import { useFieldArray, useWatch, Control, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { WorkoutFormValue } from "./form";
import { Input } from "@/components/ui/input";

type ExerciseProps = {
    control: Control<WorkoutFormValue>;
    register: UseFormRegister<WorkoutFormValue>;
    setValue: UseFormSetValue<WorkoutFormValue>;
};

export const WorkoutNameField = ({ register }: {
    register: UseFormRegister<WorkoutFormValue>
}) => (
    <div>
        <label>Workout Name</label>
        <Input {...register("name")} type="text" placeholder="Enter workout name" />
    </div>
);

export const ExerciseListField = ({ control, register }: ExerciseProps) => {
    const { fields } = useFieldArray({
        control,
        name: "exercises",
    });

    const watchExercises = useWatch({
        control,
        name: "exercises",
    });

    const selectedExercises=watchExercises?.filter((exercise) => exercise.selected) || [];

    return (
        <div className="space-y-2">
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
                            <tr key={field._id}>
                                <td className="flex items-center gap-2 p-1">
                                    <Input
                                        type="checkbox"
                                        {...register(`exercises.${index}.selected`)}
                                    />
                                    {field.name}
                                </td>
                                <td className="p-1">
                                    <Input
                                        type="number"
                                        min={0}
                                        {...register(`exercises.${index}.sets`)}
                                    />
                                </td>
                                <td className="p-1">
                                    <Input
                                        type="number"
                                        min={0}
                                        {...register(`exercises.${index}.reps`)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedExercises.length === 0 ? (
                <p>No exercises selected</p>
            ) : (
                <div className="p-2 border rounded-xl font-semibold">
                    {selectedExercises.map((ex, idx) => (
                        <div key={idx}>
                            {ex.name}: {ex.sets} sets of {ex.reps} reps
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

