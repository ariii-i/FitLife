import { useWorkoutStore } from "@/entities/workout/modal/store";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom"
import { CreateWorkoutButton } from "@/features/workouts/make-workout-request/ui/create-workout-button";

export const WorkoutList = ({ filteredExercises }: {
    filteredExercises: any
}) => {

    const { workouts } = useWorkoutStore();
    {
        (!workouts || workouts.length === 0) && (
            <Card className="bg-stone-700 p-7 rounded-xl text-stone-100 font-semibold flex-col flex justify-center items-center text-lg">
                No workout yet. Create a new one?
                <CreateWorkoutButton />
            </Card>
        )
    }
    return (
        <div>
            {filteredExercises.map((workout) => (
                <Link key={workout.id} to={`/workout/${workout.id}`} >
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