import { create } from "zustand";
import { z } from "zod";
import { createExerciseApi, editExerciseApi, ExerciseFormSchema, getExerciseApi, T_GetExerciseParams } from "../api";
import { Schema_Exercise } from "server/src/orpc-server/packages/exericse/domain/schema-exercise";

export type ExerciseStore = {
  exercises: Array<z.infer<typeof Schema_Exercise>>,
  setExercises: (exercises: Array<z.infer<typeof Schema_Exercise>>) => void,
  createExercise: (payload: z.infer<typeof ExerciseFormSchema>) => Promise<void>,
  fetchExercises: (user_id: string, filters?: T_GetExerciseParams) => Promise<void>,
  editExercise: (payload: z.infer<typeof ExerciseFormSchema>) => Promise<z.infer<typeof Schema_Exercise>>
}

export const useExerciseStore = create<ExerciseStore>((set) => ({
  exercises: [],

  setExercises: (exercises) => set({ exercises }),

  createExercise: async (payload) => {
    const created = await createExerciseApi(payload);

    set((state) => ({
      exercises: [created, ...state.exercises],
    }));
  },

  fetchExercises: async (user_id, filters) => {
    try {
      const data = await getExerciseApi(user_id, filters)
      set({ exercises: data })
    } catch (error) {
      console.error(error);
    }
  },

  editExercise: async (payload) => {
    const updated = await editExerciseApi(payload);

    set((state) => ({
      exercises: state.exercises.map((exercise) =>
        exercise.id === payload.id ? updated : exercise
      ),
    }));

    return updated;
  },

}));
