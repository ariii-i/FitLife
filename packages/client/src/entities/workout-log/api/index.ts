import { useUserStore } from "@/entities/user/modal/store";
import { sanityClient } from "@/shared/lib/sanity";
import { WorkoutLog, WorkoutLogSession } from "../modal/type";
import { orpc } from "server/src/orpc-client";
import z from "zod";
import { Schema_Workout_Session } from "server/src/orpc-server/packages/workout/domain/schema-workout-session";

const get_unique_key = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const createWorkoutLogApi = async (data:z.infer<typeof Schema_Workout_Session>) => {
    return await orpc.workout.create_session(data)
};

export const addSessionApi = async (
    workoutLogId: string,
    sessionData: Omit<WorkoutLogSession, "_key">
): Promise<WorkoutLogSession> => {
    const newSession: WorkoutLogSession = {
        _key: get_unique_key(),
        ...sessionData,
        exercise: { _type: "reference", _ref: sessionData.exercise._id || sessionData.exercise._ref }
    };


    await sanityClient
        .patch(workoutLogId)
        .append("sessions", [newSession])
        .commit();

    return newSession;
};

export const getWorkoutLogApi = async (userId: string): Promise<WorkoutLog[]> => {
    return sanityClient.fetch<WorkoutLog[]>(`
    *[_type=="workoutLog" && user._ref == $userId] {
        _id,
        date,
        user -> { _id },
        workout -> { _id, name },
        sessions[] {
            _key,
            startTime,
            endTime,
            sets,
            reps,
            weight,
            completed,
            exercise -> { _id, name }
        }
    }`, { userId });
};

export const getLast7daysApi = async (userId: string, startDate: string) => {
    return sanityClient.fetch<{ date: string }[]>(`
        *[_type=="workoutLog" && user._ref == $userId && date >= $startDate && count(sessions[completed==true]) > 0]{
            date
            }`,
        { userId, startDate });
};