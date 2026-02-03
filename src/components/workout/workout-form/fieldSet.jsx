import { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import { useExerciseStore } from "../../../store/excersiseStore";
import { Input } from "../../ui/input";

export const ExerciseFieldArray = ({ control, register, setValue }) => {
    const { exercises } = useExerciseStore();

    const { fields } = useFieldArray({
        control,
        name: "exercises",
    });

    useEffect(() => {
        setValue("exercises", exercises)
    }, [exercises])

    return (
        <table className="overflow-y-auto">
            <thead>
                <tr className="flex w-full items-center">
                    <th className="flex-1">Exercises</th>
                    <th className="flex-1">Sets</th>
                    <th className="flex-1">Reps</th>
                </tr>
            </thead>
            <tbody className="space-y-2 overflow-hidden">
                {fields.map((field, index) => (
                    <tr key={field.id} className="flex w-full gap-2 py-1 items-center">
                        <td>
                            <Input
                                {...register(`exercises.${index}.selected`)}
                                type="checkbox"
                            />
                        </td>
                        <td className="font-medium flex-1">{field.name}</td>
                        <td className="flex-1"><Input type="number" {...register(`exercises.${index}.plannedSets`)} /></td>
                        <td className="flex-1"><Input type="number" {...register(`exercises.${index}.plannedReps`)} /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}