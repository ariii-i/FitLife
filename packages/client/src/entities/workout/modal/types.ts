export type WorkoutExercise = {
    _key: string,
    plannedSets: number,
    plannedReps: number,
    exercise: {
        _id: string,
        name: string
    }
}

export type Workout = {
    _id: string,
    name: string;
    exercises: WorkoutExercise[]
}