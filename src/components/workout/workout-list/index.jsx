import { EllipsisVertical } from "lucide-react";
import { useExerciseStore } from "../../../store/excersiseStore";
import { useWorkoutExerciseStore } from "../../../store/workout-exercise";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Input } from "../../ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const ExerciseList = () => {
    const { exercises } = useExerciseStore();
    const { workoutExercises } = useWorkoutExerciseStore();

    const {register, handleSubmit}=useForm()

    return (
        <div>
            <div className="flex justify-between items-center text-xs">
                <div className="flex font-bold text-lg"> Today's Workout</div>
                {exercises.length} {exercises.length <= 1 ? 'workout' : 'workouts'}
            </div>

            <div className="overflow-y-auto space-y-2 p-2">
                {exercises.map((ex) => {
                    const we=workoutExercises.find((w) => w._id == ex._id)
                    // console.log(we)

                    return(
                        <Card key={ex._id} className="p-2">
                                <span className="font-medium">{ex.name}</span>
                            {we? (
                                <p className="text-sm">
                                    {we.plannedSets}
                                </p>
                            ) : <p className="text-sm">Not added to workout yet</p>}
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}