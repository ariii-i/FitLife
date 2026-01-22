import { useWorkoutStore } from "../../store/workout-Store";

export function WorkoutCards() {
    const { workouts, markCompleted } = useWorkoutStore();

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 py-6">
            {workouts.map((w) => (
                <div key={w._id} className="rounded-xl border border-gray-900 bg-teal-900 text-white p-4 shadow-sm">
                    <h2 className="text-lg font-semibold">{w.title}</h2>

                    <div className="text-sm py-2">
                        <p><span className="font-medium">Day </span>{w.day}</p>
                        <p><span className="font-medium">Sets </span>{w.sets}</p>
                        <p><span className="font-medium">Reps </span>{w.reps}</p>
                    </div>

                    <div className="py-2">
                        <p>Exercises</p>

                        {w.Exercises?.length ? (
                            <ul >
                                {w.Exercises.map((ex) => (
                                    <li key={ex._id}>{ex.name}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm">No exercises added</p>
                        )}
                    </div>

                    <button>
                        Mark
                    </button>
                </div>
            ))}
        </div>
    )
}