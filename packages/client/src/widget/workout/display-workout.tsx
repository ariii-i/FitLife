import { WorkoutButton } from "@/features/workouts/make-workout-request/ui/create-workout-button";
import { useWorkoutStore } from "../../entities/workout/modal/store"
import { WorkoutActionMenu } from "@/features/workouts/action-menu/ui";

export const DisplayWorkout = () => {
    const { workouts } = useWorkoutStore();

    return (
        <div>
            <p className="text-stone-500 text-xs">
                {workouts.length} {workouts.length <= 1 ? "workout" : "workouts"}
            </p>
            {workouts.map((w) => (
                <div key={w._id} className="border-b border-dashed p-5 font-semibold flex items-center justify-between">
                    {w.name}
                    <WorkoutActionMenu workoutId={w._id} />

                </div>
            ))}
        </div>
    )
}