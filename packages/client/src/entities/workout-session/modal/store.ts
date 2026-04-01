import { Schema_Workout_Session_Create } from "server/src/orpc-server/packages/workout/domain/schema-workout-session";
import z from "zod";
import { create } from "zustand";
import { create_session } from "../api";

type WorkoutSessionStore = {
  workoutSession: Array<z.infer<typeof Schema_Workout_Session_Create>>;
  createSession: (
    payload: z.infer<typeof Schema_Workout_Session_Create>,
  ) => Promise<void>;
};

export const useWorkoutSessionStore = create<WorkoutSessionStore>((set) => ({
  workoutSession: [],

  createSession: async (payload) => {
    const created = await create_session(payload);

    set((state) => ({
      workoutSession: [created, ...state.workoutSession],
    }));
  },
}));
