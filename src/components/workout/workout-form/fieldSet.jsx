import { useEffect, useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { useExerciseStore } from "../../../store/excersiseStore";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import { useWorkoutExerciseStore } from "../../../store/workout-exercise";

export const ExerciseFieldArray = ({ control, register, setValue }) => {
    const { exercises } = useExerciseStore();

    const { fields } = useFieldArray({
        control,
        name: "exercises",
    });

    useEffect(() => {
        setValue("exercises", exercises)
    }, [exercises])

    const [addList, setAddList] = useState(false);
    const watchExercises = useWatch(
        {
            control,
            name: "exercises"
        }
    )

    return (
        <div>
            <div className="border border-dashed p-2 rounded-xl border-stone-300">
                <table className="overflow-y-auto">
                    <thead>
                        <tr className="flex w-full items-center">
                            <th className="flex-1">Exercises</th>
                            <th className="flex-1">Sets</th>
                            <th className="flex-1">Reps</th>
                        </tr>
                    </thead>

                    <tbody className="space-y-2 overflow-hidden">
                        {fields.map((field, index) => {
                            const isSelected = watchExercises?.[index].selected;
                            const sets = watchExercises?.[index].plannedSets;
                            const reps = watchExercises?.[index].plannedReps;
                            return (
                                <tr key={field.id} className="flex w-full gap-2 py-1 items-center">
                                    <td>
                                        <Input
                                            {...register(`exercises.${index}.selected`)}
                                            type="checkbox"/>
                                    </td>
                                    <td className="font-medium flex-1">{field.name}</td>
                                    <td className="flex-1"><Input type="number" {...register(`exercises.${index}.plannedSets`)} /></td>
                                    <td className="flex-1"><Input type="number" {...register(`exercises.${index}.plannedReps`)} /></td>
                                    <td>
                        {(isSelected || sets || reps) && (
                            <div className="bg-stone-100 rounded-lg px-3 py-2 text-sm">
                                {sets || 0} sets × {reps || 0} reps selected
                            </div>
                        )}
                                    </td>
                                </tr>
                                
                                )
                        })}
                        <tr>
                            <td><Button className="w-full" variant="outline" onClick={() => setAddList(true)}><Plus /> Add List</Button></td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>

            {addList && <HandleAddList />}
            {addList === true ? "hi" : "bye"}
        </div>
    )
}

const HandleAddList = () => {
    const { workoutExercises } = useWorkoutExerciseStore()
    return (
        <div>
            <pre>{JSON.stringify(workoutExercises, null, 2)}</pre>
            <h1>Exercsies</h1>
            {/* {workoutExercises.map((w) => w.selected=== true? )} */}
        </div>
    )
}