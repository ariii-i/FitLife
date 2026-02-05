import { EllipsisVertical } from "lucide-react";
import { useExerciseStore } from "../../../store/excersiseStore";
import { useWorkoutExerciseStore } from "../../../store/workout-exercise";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";

export const ExerciseList = () => {
    const { exercises } = useExerciseStore();
    const { workoutExercises } = useWorkoutExerciseStore();

    return (
        <div className=" ">
            <div className="flex justify-between items-center text-xs">
                <div className="flex font-semibold text-lg"> Today's Workout</div>
                {exercises.length} {exercises.length <= 1 ? 'workout' : 'workouts'}
            </div>

            <div className="overflow-y-auto space-y-2">
                {exercises.map((ex) =>
                    <Card key={ex._id} className="flex items-center justify-between p-1 px-2">
                        <span>{ex.name}</span>
                        <Button variant="ghost"><EllipsisVertical /></Button>

                    </Card>
                )}
            </div>
            
        </div>
    )
}