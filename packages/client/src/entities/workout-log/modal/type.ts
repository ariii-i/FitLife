export type WorkoutLogSession = {
    _key: string;
    exercise: { _id?: string; name?: string, _type?: "reference", _ref?: string; };
    startTime: string;
    endTime: string;
    sets: number;
    reps: number;
    weight: number;
    completed: boolean;
};

export type WorkoutLog = {
    _type?: string;
    _id?: string;
    date: string;
    user: {_type?: "reference", _ref?: string };
    workout: { _type?: "reference"; _ref?: string };
    sessions: WorkoutLogSession[];
};