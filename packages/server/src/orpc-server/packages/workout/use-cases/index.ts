import { os } from "@orpc/server";
import * as z from "zod";
import type { IncomingHttpHeaders } from "node:http";
import {
  Schema_Create_Workout,
  Schema_Create_Workout_Output,
  Schema_Update_Workout,
  Schema_Workout,
} from "../domain/schema-workout";
import { Schema_Workout_Session } from "../domain/schema-workout-session";
import { WorkoutModel } from "../domain/workout";
import { WorkoutSessionModel } from "../domain/workout-session";
import { WorkoutExerciseModel } from "../domain/workout-exercise";
import { ExerciseModel } from "../../exericse/domain/exercise";

export const list_workout = os
  .input(
    z.object({
      pageSize: z.number().int().min(1).max(100).default(10),
      pageIndex: z.number().int().min(0).default(0),
    })
  )
  .handler(async ({ input }) => {
    return WorkoutModel.query()
      .limit(input.pageSize)
      .offset(input.pageIndex * input.pageSize);
  });

export const list_workout_by_user = os
  .input(
    z.object({
      user_id: z.number().int(),
      pageSize: z.number().int().min(1).max(100).default(10),
      pageIndex: z.number().int().min(0).default(0),
    })
  )
  .handler(async ({ input }) => {
    return WorkoutModel.query()
      .where("user_id", input.user_id)
      .limit(input.pageSize)
      .offset(input.pageIndex * input.pageSize);
  });

export const find_workout = os
  .input(Schema_Workout.pick({ id: true }))
  .handler(async ({ input }) => {
    const res = await WorkoutModel.query().findById(input.id).withGraphFetched("exercises");
    return res?.toJSON();
  });

/**
 * AS A USER I WANT TO CREATE A WORKOUT WITH ASSICIATED EXERCISE SO THAT I CAN TRACK MY PROGRESS
 */
export const create_workout = os
  .$context<{ headers: IncomingHttpHeaders }>()
  .input(Schema_Create_Workout)
  .output(Schema_Create_Workout_Output)
  .handler(async ({ input }) => {
    const { exercises, ...workout_payload } = input;
    const workout_created = await WorkoutModel.query().insert(workout_payload);

    const workout_exercises_payload = input.exercises.map((exercise) => {
      return {
        ...exercise,
        workout_id: workout_created.id,
      };
    });

    const workout_exercises_created =
      await WorkoutExerciseModel.query().insertGraph(workout_exercises_payload);
    return {
      ...workout_created,
      exercises: workout_exercises_created,
    };
  });
export const update_workout = os
  .$context<{ headers: IncomingHttpHeaders }>()
  .input(Schema_Update_Workout)
  .output(Schema_Create_Workout_Output)
  .handler(async ({ input }) => {
    const { exercises, id } = input;

    const workout_updated = await WorkoutModel.query().patchAndFetchById(id, {
      name: input.name,
    });

    await WorkoutExerciseModel.query().delete().where("workout_id", id);

    const workout_exercises_payload = exercises.map((exercise) => {
      return {
        ...exercise,
        workout_id: id,
      };
    });

    const workout_exercises_updated =
      await WorkoutExerciseModel.query().insertGraph(workout_exercises_payload);

    return {
      ...workout_updated,
      exercises: workout_exercises_updated,
    };
  });

export const find_last_session_of_a_user = os
  .input(
    z.object({
      user_id: z.number().int(),
    })
  )
  .handler(async ({ input }) => {
    return WorkoutSessionModel.query()
      .select("workout.name", "workout_sessions.*")
      .joinRelated("workout")
      .findOne("workout_sessions.user_id", input.user_id)
      .orderBy("performed_at", "desc");
  });

export const create_session = os
  .input(Schema_Workout_Session.omit({ id: true, exercises_done: true }))
  .handler(async ({ input }) => {
    return WorkoutSessionModel.query().insert(input);
  });

export const get_current_streak_for_a_user = os
  .input(
    z.object({
      user_id: z.number().int(),
    })
  )
  .handler(async ({ input }) => {
    const result = await WorkoutSessionModel.query().select(
      WorkoutSessionModel.raw(
        `
    (
      WITH dates AS (
        SELECT DISTINCT DATE(performed_at) AS day
        FROM workout_sessions
        WHERE user_id = ?
      ),
      streak AS (
        SELECT day,
               ROW_NUMBER() OVER (ORDER BY day DESC) AS rn
        FROM dates
      )
      SELECT COUNT(*)
      FROM streak
      WHERE JULIANDAY('now') - JULIANDAY(day) = rn - 1
    ) as current_streak
  `,
        [input.user_id]
      )
    );

    return (result[0] as any).current_streak;
  });

export const check_if_user_has_done_workout_on_this_date = os
  .input(
    z.object({
      user_id: z.number().int(),
      date: z.string(),
    })
  )
  .output(
    z.object({
      done: z.boolean(),
    })
  )
  .handler(async ({ input }) => {
    const res = await WorkoutSessionModel.query()
      .count("* as exercises_done")
      .where("user_id", input.user_id)
      .where("performed_at", input.date)
      .first();

    if (!res?.exercises_done) {
      return { done: false };
    }

    return {
      done: res.exercises_done > 0,
    };
  });

export const list_exercise_in_a_workout = os
  .input(
    z.object({
      workout_id: z.number().int(),
    })
  )
  .handler(async ({ input }) => {
    return await WorkoutExerciseModel.query()
      .select("exercise.name", "exercise.muscle_group", "workout_exercises.*")
      .joinRelated("exercise")
      .where("workout_id", input.workout_id);
  });

export const get_streak_based_on_dates = os
  .input(
    z.object({
      user_id: z.number().int(),
      start_date: z.string(),
      end_date: z.string(),
    })
  )
  .output(z.array(z.object({ date: z.string(), done: z.boolean() })))
  .handler(async ({ input }) => {
    const { user_id, start_date, end_date } = input;

    const start = new Date(start_date);
    const end = new Date(end_date);

    const doneDates = await WorkoutSessionModel.query()
      .select(WorkoutSessionModel.raw("DISTINCT DATE(performed_at) as workout_date"))
      .where("user_id", user_id)
      .whereRaw("DATE(performed_at) >= ?", [start_date])
      .whereRaw("DATE(performed_at) <= ?", [end_date])
      .castTo<{ workout_date: string }[]>();

    const doneSet = new Set(doneDates.map((d) => d.workout_date));

    const dates: { date: string; done: boolean }[] = [];
    const current = new Date(start);
    while (current <= end) {
      const dateStr = current.toISOString().split("T")[0];
      dates.push({
        date: dateStr,
        done: doneSet.has(dateStr),
      });
      current.setDate(current.getDate() + 1);
    }

    return dates;
  });

export const get_workout_history_chart_data = os
  .input(
    z.object({
      user_id: z.number().int(),
      date: z.string(),
    })
  )
  .output(
    z.array(
      z.object({
        workout_id: z.number(),
        workout_name: z.string(),
        performed_at: z.string(),
        exercises_data: z.array(
          z.object({
            exercise_name: z.string(),
            planned_sets: z.number().nullable(),
            planned_reps: z.number().nullable(),
            actual_sets: z.number().nullable(),
            actual_reps: z.number().nullable(),
            performed_at: z.string().nullable(),
          })
        ),
      })
    )
  )
  .handler(async ({ input }) => {
    const { user_id, date } = input;

    const sessions = await WorkoutSessionModel.query()
      .select(
        "workout_sessions.*",
        "workout.name as workout_name",
        "exercise.name as exercise_name"
      )
      .joinRelated("workout")
      .joinRelated("exercise")
      .where("workout_sessions.user_id", user_id)
      .whereRaw("DATE(workout_sessions.performed_at) = ?", [date])
      .castTo<
        {
          id: number;
          workout_id: number;
          workout_name: string;
          exercise_id: number;
          exercise_name: string;
          sets: number | null;
          reps: number | null;
          performed_at: string;
        }[]
      >();

    const workoutMap = new Map<
      number,
      {
        workout_id: number;
        workout_name: string;
        performed_at: string;
        exercises_data: {
          exercise_name: string;
          planned_sets: number | null;
          planned_reps: number | null;
          actual_sets: number | null;
          actual_reps: number | null;
          performed_at: string | null;
        }[];
      }
    >();

    for (const session of sessions) {
      if (!workoutMap.has(session.workout_id)) {
        const plannedExercises = await WorkoutExerciseModel.query()
          .select(
            "exercise.name as exercise_name",
            "workout_exercises.sets",
            "workout_exercises.reps"
          )
          .joinRelated("exercise")
          .where("workout_exercises.workout_id", session.workout_id)
          .castTo<
            {
              exercise_name: string;
              sets: number | null;
              reps: number | null;
            }[]
          >();

        workoutMap.set(session.workout_id, {
          workout_id: session.workout_id,
          workout_name: session.workout_name,
          performed_at: session.performed_at,
          exercises_data: plannedExercises.map((pe) => ({
            exercise_name: pe.exercise_name,
            planned_sets: pe.sets,
            planned_reps: pe.reps,
            actual_sets: null,
            actual_reps: null,
            performed_at: null,
          })),
        });
      }

      const workout = workoutMap.get(session.workout_id)!;
      const exerciseData = workout.exercises_data.find(
        (e) => e.exercise_name === session.exercise_name
      );
      if (exerciseData) {
        exerciseData.actual_sets = session.sets;
        exerciseData.actual_reps = session.reps;
        exerciseData.performed_at = session.performed_at;
      }
    }

    return Array.from(workoutMap.values());
  });
