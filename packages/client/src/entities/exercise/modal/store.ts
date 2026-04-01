import { create } from "zustand";
import { z } from "zod";
import {
  createExerciseApi,
  editExerciseApi,
  getExerciseApi,
  type T_GetExerciseParams,
  ExerciseFormSchema,
} from "../api";
import { Schema_Exercise } from "server/src/orpc-server/packages/exericse/domain/schema-exercise";

export type ExerciseStore = {
  exercises: Array<z.infer<typeof Schema_Exercise>>;
  setExercises: (exercises: Array<z.infer<typeof Schema_Exercise>>) => void;
  createExercise: (
    payload: z.infer<typeof ExerciseFormSchema>,
  ) => Promise<void>;
  fetchExercises: (filters: T_GetExerciseParams) => Promise<void>;
  editExercise: (
    payload: z.infer<typeof ExerciseFormSchema>,
  ) => Promise<z.infer<typeof Schema_Exercise>>;
};

export const useExerciseStore = create<ExerciseStore>((set) => ({
  exercises: [],

  setExercises: (exercises) => set({ exercises }),

  fetchExercises: async (filters) => {
    const data = await getExerciseApi(filters);
    set({ exercises: data });
  },

  createExercise: async (payload) => {
    await createExerciseApi(payload);
  },

  editExercise: async (payload) => {
    const updated = await editExerciseApi(payload);

    set((state) => ({
      exercises: state.exercises.map((exercise) =>
        exercise.id === payload.id ? updated : exercise,
      ),
    }));
    return updated;
  },
}));
