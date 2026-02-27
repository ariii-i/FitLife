import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUserStore } from "../../entities/user/store";
import { useWorkoutLogStore } from "../../entities/workout-log/store";
import { useWorkoutStore } from "../../entities/workout/store";
import { WorkoutForm } from "../../features/workouts/add-workouts";
import { Button } from "../../shared/ui/button";
import { Card } from "../../shared/ui/card";
import { auth } from "../../shared/lib/firebase";

export const WorkoutDetails = () => {
    const { workoutId } = useParams();
    const { fetchUser } = useUserStore()
    const { workout, fetchSelectedWorkout } = useWorkoutStore();
    const navigate = useNavigate()

    useEffect(() => {
        fetchSelectedWorkout(workoutId);
        fetchUser(auth.currentUser.uid)
    }, [])


    return (
        <div className="font-semibold text-xl p-2">
            {workout?.name}

            {(!workout?.exercises || workout.exercises.length === 0) && (
                <Card className="bg-stone-700 p-7 rounded-xl text-stone-100 font-semibold flex-col flex justify-center items-center text-lg">
                    No exercises yet.
                    <WorkoutForm />
                </Card>
            )}

            {workout?.exercises?.map((w) => (
                <Link key={w.id} to={`/workout/${workoutId}/session/${w.exercise._id}`}>
                    <Card className="bg-stone-700 p-5 rounded-xl text-stone-100 font-semibold flex justify-between items-center text-lg">
                        {w.exercise.name}
                        <div className="font-medium text-sm text-stone-300">
                            {w.plannedSets} sets x {w.plannedReps} reps
                        </div>
                    </Card>
                </Link>
            ))}

            <div className="py-2 flex justify-end">
                <Link to="/"><Button type="button" variant="link">Back to Dashboard</Button></Link>
            </div>
        </div>
    )
}