import { orpc } from "@/shared/lib/orpc";
import { Schema_Workout_Session } from "server/src/orpc-server/packages/workout/domain/schema-workout-session";
import z from "zod";

export const create_session = async (
    payload: z.infer<typeof Schema_Workout_Session>,
) => {
    return orpc.workout.create_session(payload)
};