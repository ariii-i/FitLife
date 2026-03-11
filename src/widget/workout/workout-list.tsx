import { useWorkoutStore } from "@/entities/workout/modal/store";
import { WorkoutForm } from "@/features/workouts/add-workouts";
import { Card } from "@/shared/ui/card";
import { Link } from "react-router-dom"

export const WorkoutList: React.FC = () => {

    const { workouts } = useWorkoutStore();
    {
        (!workouts || workouts.length === 0) && (
            <Card className="bg-stone-700 p-7 rounded-xl text-stone-100 font-semibold flex-col flex justify-center items-center text-lg">
                No workout yet. Create a new one?
                <WorkoutForm />
            </Card>
        )
    }
    return (
        <div>
            {workouts.map((workout) => (
                <Link key={workout._id} to={`/workout/${workout._id}`} >
                    <Card className="bg-stone-700 p-5 rounded-xl text-stone-100">
                        {workout.name}
                    </Card>
                </Link>
            ))}

            {/* {workouts.map((workout) => (
                <Card key={workout._id} className="bg-stone-700 p-5 rounded-xl text-stone-100 flex items-center justify-between">
                    <Link to={`/workout/${workout._id}`} >
                        {workout.name}
                    </Link>
                    <WorkoutFields workoutId={workout._id} />
                </Card>
            ))} */}
        </div>
    )
}