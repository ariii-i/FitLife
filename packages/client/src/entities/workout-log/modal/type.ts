export type WorkoutLogSession = {
    _key: string;
    exercise: { _id: string; name: string };
    startTime: string;
    endTime: string;
    sets: number;
    reps: number;
    weight: number;
    completed: boolean;
};

export type WorkoutLog = {
    _id: string;
    date: string;
    user: { _id: string };
    workout: { _id: string; name: string };
    sessions: WorkoutLogSession[];
};