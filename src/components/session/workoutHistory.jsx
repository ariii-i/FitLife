import { useCallback, useEffect, useState } from "react"
import { useWorkoutLogStore } from "../../store/workoutLogStore"
import { useWorkoutExerciseStore } from "../../store/workout-exercise"

export const WorkoutHistory = ({ sessionId }) => {
    const { workoutLog, fetchWorkoutLog } = useWorkoutLogStore()
    const { workoutExercises, fetchDetail } = useWorkoutExerciseStore()

    const [sessions, setSessions]=useState(null)
    const init = useCallback(async () => {
        const data = await fetchDetail(sessionId)
        console.log({ data })
        setSessions(data)
      }, [sessionId])
    
      useEffect(() => {
        init()
      }, [init])
      console.log("console logggg", sessions)

    console.log("workoutExercisessss", workoutExercises, null, 2)
    return (
        <div className="space-y-4">
            <pre>
                {JSON.stringify(workoutLog, null, 2)}
            </pre>
            <h2 className="text-xl font-semibold">Workout History</h2>

            {workoutLog.map((log) => (
                <div key={log._id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="text-sm text-gray-500">{log.date}</p>

                    <h3 className="mt-1 text-lg font-semibold text-gray-800">{log.workoutExercises?.exercise?.name}</h3>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
                        <p> <span className="font-medium">Sets:</span> {log.sets} </p>

                        <p><span className="font-medium">Reps:</span> {log.reps}</p>

                        <p> <span className="font-medium">Weight:</span> {log.weight} kg </p>

                        <p> <span className="font-medium">Duration:</span> {log.duration} min </p>
                    </div>
                </div>
            ))}

            {workoutExercises.map((we) => (
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
                    <p> <span className="font-medium">Sets:</span> {we.plannedSets} </p>
                    <p><span className="font-medium">Reps:</span> {we.plannedReps}</p>
                </div>
            ))}
        </div>
    )
}