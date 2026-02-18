import { useWorkoutStore } from "../../entities/workout/store"

export const DisplayWorkout = () => {
    const { workouts } = useWorkoutStore()
    return (
        <div>
            <p className="text-gray-500 text-xs">
                {workouts.length} {workouts.length <= 1 ? "workout" : "workouts"}
            </p>
            {workouts.map((w) => (
                <div key={w._id} className="border-b border-dashed p-5 font-semibold">
                    {w.name}
                </div>
            ))}
        </div>
    )
}