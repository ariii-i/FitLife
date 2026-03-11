import { useWorkoutStore } from "../../entities/workout/modal/store"
import { WorkoutFields } from "../../features/workouts/workout-dropdownmenu";

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
                    <WorkoutFields workoutId={w._id}/>
                </div>
            ))}
        </div>
    )
}