import { create } from "zustand";
import { MuscleGroup } from "../config";

export type ExerciseFilterStore = {
  name: string;
  muscleGroup: MuscleGroup | null;
  setName: (name: string) => void;
  setMuscleGroup: (group: MuscleGroup | null) => void;
  clearFilters: () => void;
}

export const useExerciseFilterStore = create<ExerciseFilterStore>((set) => ({
  name: "",
  muscleGroup: null,

  setName: (name) => set({ name }),

  setMuscleGroup: (muscleGroup) => set({ muscleGroup }),

  clearFilters: () => set({ name: "", muscleGroup: null }),
}));
