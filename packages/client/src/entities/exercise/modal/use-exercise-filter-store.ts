import { MuscleGroupEnum } from "server/src/orpc-server/packages/exericse/domain/schema-exercise";
import z from "zod";
import { create } from "zustand";

const tttt = z.object({
  name: z.string().optional(),
  muscle_group: MuscleGroupEnum.optional(),
});
export type ExerciseFilterStore = {
  filters: z.infer<typeof tttt>;
  setFilters: (
    filters: ExerciseFilterStore["filters"],
  ) => ExerciseFilterStore["filters"];
  clearFilters: () => void;
};

export const useExerciseFilterStore = create<ExerciseFilterStore>(
  (set, get) => ({
    filters: {
      name: "",
      muscle_group: "all",
    },

    setFilters: (filters) => {
      set({ filters });

      return get().filters;
    },

    clearFilters: () => set({ filters: { name: "" } }),
  }),
);
