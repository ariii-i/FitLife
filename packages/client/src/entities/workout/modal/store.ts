import {
    Schema_Create_Workout,
    Schema_Update_Workout,
    Schema_Workout,
} from "server/src/orpc-server/packages/workout/domain/schema-workout";
import { Schema_Workout_Exercise } from "server/src/orpc-server/packages/workout/domain/schema-workout-exercise";
import z from "zod";
import { create } from "zustand";
import {
    createWorkoutApi,
    get_workout_detail,
    getWorkoutApi,
    updateWorkoutApi
} from "../api";

type WorkoutStore = {
    workouts: Array<z.infer<typeof Schema_Workout>>;
    workout: z.infer<typeof Schema_Workout_Exercise> | null;
    createWorkout: (
        payload: z.infer<typeof Schema_Create_Workout>,
        cb?: () => void,
    ) => Promise<void>;
    fetchWorkouts: (params: {
        user_id: string;
        pageIndex?: number;
        pageSize?: number;
    }) => Promise<void>;
    fetchWorkoutDetail: (workout_id: number) => Promise<any>;
    // fetchSelectedWorkout: (workoutid: number) => Promise<void>;
    updateWorkout: (
        payload: z.infer<typeof Schema_Update_Workout>,
    ) => Promise<void>;
    // deleteWorkout: (id: string) => Promise<void>;
    clearWorkouts: () => void;
};

export const useWorkoutStore = create<WorkoutStore>((set) => ({
    workouts: [],
    workout: null,

    fetchWorkouts: async (params) => {
        const data = await getWorkoutApi(params);
        set({ workouts: data });
    },

    fetchWorkoutDetail: async (workout_id) => {
        const data = await get_workout_detail(workout_id);
        return data;
    },

    createWorkout: async (payload, cb) => {
        await createWorkoutApi(payload);
        cb?.();
    },

    // fetchSelectedWorkout: async (workout_id: number) => {
    //     const data = await getSelectedWorkoutApi(workout_id);

    //     set({ workout: data || null });
    // },

    updateWorkout: async (payload) => {
        await updateWorkoutApi(payload);
    },

    // deleteWorkout: async (id) => {
    //   await deleteWorkoutApi(id);

    //   set((state) => ({
    //     workouts: state.workouts.filter((w) => w._id !== id),
    //   }));
    // },

    clearWorkouts: () => {
        set({ workouts: [] });
    },
}));
