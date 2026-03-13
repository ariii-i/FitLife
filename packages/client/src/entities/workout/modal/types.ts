export type WorkoutExercise = {
    _key: string,
    plannedSets: number,
    plannedReps: number,
    selected: boolean
    exercise: {
        _id: string,
        name: string
    } | {
        _type: "reference",
        _ref: string
    }
}

export type WorkoutType = {
    _id: string,
    name: string;
    exercises: WorkoutExercise[]
}