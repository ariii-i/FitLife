import { Link, useNavigate } from "react-router-dom";
import { useWorkoutStore } from "../../entities/workout/store";
import { StreaksTrack } from "../../features/streaks";
import { DisplayWorkoutList } from "./display-workouts";
import { Card } from "../../shared/ui/card";
import { WorkoutForm } from "../../features/workouts/add-workouts";

export const Dashboard = () => {
    const navigate = useNavigate()
    const { workouts, workout, fetchSelectedWorkout } = useWorkoutStore();

    return (
        <div>
            <StreaksTrack />
            {/* <DisplayWorkoutList /> */}
            <div className="space-y-2 font-semibold">
                Today's Workout:

                {(!workouts || workouts.length === 0) && (
                    <Card className="bg-stone-700 p-7 rounded-xl text-stone-100 font-semibold flex-col flex justify-center items-center text-lg">
                        No workout yet. Create a new one?
                        <WorkoutForm />
                    </Card>
                )}

                {workouts.map((workout) => (
                    <Link key={workout._id} to={`/workout/${workout._id}`} >
                        <Card className="bg-stone-700 p-5 rounded-xl text-stone-100">
                            {workout.name}
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
