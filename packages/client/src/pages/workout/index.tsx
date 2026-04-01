import { useExerciseStore } from "@/entities/exercise/modal/store";
import { useExerciseFilterStore } from "@/entities/exercise/modal/use-exercise-filter-store";
import { useWorkoutStore } from "@/entities/workout/modal/store";
import { WorkoutButton } from "@/features/workouts/make-workout-request/ui/create-workout-button";
import { auth } from "@/shared/lib/firebase";
import { DisplayWorkout } from "@/widget/workout/display-workout";
import { useEffect } from "react";

export const Workout = () => {
    const { fetchWorkouts } = useWorkoutStore();
    const { fetchExercises } = useExerciseStore();
    const { filters } = useExerciseFilterStore();

    useEffect(() => {
        fetchWorkouts({
            pageIndex: 0,
            pageSize: 100,
            user_id: auth.currentUser?.uid || "",
        });
        fetchExercises({ ...filters, user_id: auth?.currentUser?.uid as string });
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center font-semibold text-xl">
                Workouts
                <WorkoutButton />
            </div>
            <DisplayWorkout />
        </div>
    );
};
