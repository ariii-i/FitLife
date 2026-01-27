import { create } from "zustand"

export const useExerciseLogStore = create((set, get) => ({
  logs: [],

  toggleExercise: (workoutId, exerciseId) => {
    set((state) => {
      const existing = state.logs.find(
        l => l.workoutId === workoutId && l.exerciseId === exerciseId
      )

      if (existing) {
        return {
          logs: state.logs.map(l =>
            l === existing ? { ...l, completed: !l.completed } : l
          )
        }
      }

      return {
        logs: [
          ...state.logs,
          {
            workoutId,
            exerciseId,
            completed: true,
            date: new Date().toISOString()
          }
        ]
      }
    })
  },

  isExerciseCompleted: (workoutId, exerciseId) =>
    get().logs.some(
      l => l.workoutId === workoutId &&
           l.exerciseId === exerciseId &&
           l.completed
    )
}))
