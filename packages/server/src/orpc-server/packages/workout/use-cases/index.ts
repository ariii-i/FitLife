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
