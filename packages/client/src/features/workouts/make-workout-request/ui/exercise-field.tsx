import { useFieldArray, useWatch, Control, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { WorkoutFormValue, PlannedValue } from "./form";
import { Input } from "@/components/ui/input";

type Props = {
    control: Control<WorkoutFormValue>;
    register: UseFormRegister<WorkoutFormValue>;
    setValue: UseFormSetValue<WorkoutFormValue>;
};

export const ExerciseListField = ({ control, register, setValue }: Props) => {
    const { fields } = useFieldArray<WorkoutFormValue, "exercises", "_id">({
        control,
        name: "exercises",
        keyName: "_id",
    });

    const watchExercises = useWatch({ control, name: "exercises" });
    const selectedExercises = watchExercises?.filter((ex) => ex.sets || ex.reps ) || [];

    return (
        <div className="space-y-2 ">
            <div className="border border-dashed p-1 rounded-xl border-stone-300">
                <table>
                    <thead>
                        <tr>
                            <th>Exercises</th>
                            <th>Sets</th>
                            <th>Reps</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fields.map((field, index) => (
                            <tr key={field._id} className="space-y-2">
                                <td className="flex items-center gap-2 p-1">
                                    {/* <Input type="checkbox" className="w-4 h-4" {...register(`exercises.${index}.selected`)} /> */}
                                    {field.name}
                                </td>
                                <td className="p-1">
                                    <Input type="number" min={0} {...register(`exercises.${index}.sets`)} />
                                </td>
                                <td className="p-1">
                                    <Input type="number" min={0} {...register(`exercises.${index}.reps`)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedExercises.length === 0 ? (
                <p>No exercises selected</p>
            ) : (
                <div className="p-2 border rounded-xl  font-semibold">
                    {selectedExercises.map((ex, idx) => (
                        <div key={idx}>
                            {/* {ex.name}: {ex.sets} sets of {ex.reps} reps */}
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};