import { create } from "zustand";

export const useExersiseStore = create((set) => ({
    exercises: [
        { id: '1', name: 'Bench Press', mmuscleGroup: 'Chest', equipment: 'Barbell' },
        { id: '2', name: 'Squat', mmuscleGroup: 'Legs', equipment: 'Barbell' },
        { id: '3', name: 'Deadlift', mmuscleGroup: 'Back', equipment: 'Barbell' },
        { id: '4', name: 'Pull-ups', mmuscleGroup: 'Back', equipment: 'Bodyweight' }
    ],

    addExercise: (exercise) => set((state) => ({
        exercises: [...state.exercises, { ...exercise, id: Date.now().toString() }]
    })),

    deleteExercise: (id) => set((state) => ({
        exercises: state.exercises.filter(ex => ex.id !== id)
    }))
}))
