import { Card } from "@/components/ui/card";
import { WorkoutActionMenu } from "@/features/workouts/action-menu/ui";
import { useWorkoutStore } from "../../entities/workout/modal/store";

export const DisplayWorkout = () => {
    const { workouts } = useWorkoutStore();

    return (
        <div>
            <p className="text-stone-500 text-xs">
                {workouts.length} {workouts.length <= 1 ? "workout" : "workouts"}
            </p>

            {workouts.map((workout) => (
                <Card
                    key={workout.id}
                    className="bg-gray-800 border border-gray-700 rounded-md p-5 text-stone-100 font-semibold text-lg flex justify-between mt-2" >
                    {workout.name}
                    <WorkoutActionMenu selectedWorkout={workout} />
                </Card>
            ))}
        </div>
    );
};
