import { useNavigate, useParams } from "react-router-dom"
import { useWorkoutStore } from "../../entities/workout/store";
import { useEffect } from "react";
import { Button } from "../../components/ui/button";
import { useWorkoutLogStore } from "../../entities/workout-log/store";
import { sanityClient } from "../../components/lib/sanity";
import { useUserStore } from "../../entities/user/store";


export const WorkoutDetails = () => {
    const { workoutId } = useParams();
    const { users, fetchUsers } = useUserStore()
    const { workout, fetchSelectedWorkout } = useWorkoutStore();
    const { startSession, stopSession, activeSession } = useWorkoutLogStore();
    const navigate = useNavigate()

    useEffect(() => {
        fetchSelectedWorkout(workoutId);
        fetchUsers()
    }, [])
    const USER_ID = users[0]?._id;


    const handleStart = async (exerciseId) => {
        const result = await startSession(
            USER_ID,
            workoutId,
            exerciseId
        )
        console.log("Started", result);
        navigate(`/${workoutId}/:session/${sessionId}`)
    }



    return (
        <div className="space-y-2 font-semibold text-xl p-2">
            {workout?.name}
            <pre>{JSON.stringify(USER_ID, null, 2)}H</pre>

            {(!workout?.exercises || workout.exercises.length === 0) && (
                <div className="border rounded-xl p-3 bg-white shadow-sm font-semibold">
                    No exercise name
                </div>
            )}

            {workout?.exercises?.map((w) => (
                <div key={w._id} className="border rounded-xl p-3 space-y-2 bg-white shadow-sm font-semibold flex justify-between items-center text-lg">
                    {w.exercise.name}
                    <div className="font-medium text-sm text-gray-600">
                        {w.plannedSets} sets x {w.plannedReps} reps
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={() => handleStart(w.exercise._id)}>Start</Button>
                        <Button onClick={() => navigate(`/workout/${workoutId}/session/${sessionId}`)}>Stop</Button>
                    </div>
                </div>
            ))}
        </div>
    )
}