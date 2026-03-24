import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUserStore } from "@/entities/user/modal/store";
import { useWorkoutLogStore } from "@/entities/workout-log/modal/store";
import { useWorkoutStore } from "@/entities/workout/modal/store";
import { CreateWorkoutButton } from "@/features/workouts/make-workout-request/ui/create-workout-button";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { auth } from "../../shared/lib/firebase";

export const WorkoutDetails = () => {
    const { workoutId } = useParams<{ workoutId: string }>();
    const id = Number(workoutId)
    const { fetchUser } = useUserStore()
    const { workoutLogs, fetchWorkoutLogs } = useWorkoutLogStore()
    const { workouts, workout, fetchSelectedWorkout } = useWorkoutStore();

    useEffect(() => {
        if (!workoutId) return;
        fetchSelectedWorkout(id);
        // if (auth.currentUser?.uid) {
        //     fetchUser(auth.currentUser.uid);
        //     fetchWorkoutLogs(auth.currentUser.uid);
        // }
    }, [workoutId, fetchSelectedWorkout, fetchUser, fetchWorkoutLogs])

    return (
        <div className="font-semibold text-xl p-2">
            <pre>{JSON.stringify(workout, null, 2)}hh</pre>
            {/* {workout?.name}hhh
            {workout?.[0]?.name} */}

            {(!workout || workout.length === 0) && (
                <Card className="bg-stone-700 p-7 rounded-xl text-stone-100 font-semibold flex-col flex justify-center items-center text-lg">
                    No exercises yet.
                    <CreateWorkoutButton />
                </Card>
            )}

            {workout?.map((workout) => {
                const exerciseId = workout.exercise_id
                return (
                    <Link key={workout.id} to={`/workout/${workoutId}/session/${exerciseId}`}>
                        <Card className="bg-stone-700 p-5 rounded-xl text-stone-100 font-semibold flex justify-between items-center text-lg">
                            <span>{workout.name}</span>

                            <div className="font-medium text-sm text-stone-300">
                                {workout.sets} sets x {workout.reps} reps
                            </div>
                        </Card>
                    </Link>
                )
            })}

            <div className="py-2 flex justify-end">
                <Link to="/"><Button type="button" variant="link">Back to Dashboard</Button></Link>
            </div>
        </div>
    )
}