import { Input } from "@/components/ui/input";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { When } from "react-if";

export const WorkoutNameField = () => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <div>
            <label className="text-sm text-stone-500">Workout Name</label>
            <Controller
                control={control}
                name="name"
                render={({ field }) => (
                    <Input
                        id="name"
                        placeholder="e.g. Bench Press"
                        value={field.value || ""}
                        onChange={(e) => {
                            field.onChange(e.target.value);
                        }}
                    />
                )}
            />
            
            <When condition={!!errors.name}>
                <div className="text-destructive text-sm">
                    {errors?.name?.message + ""}
                </div>
            </When>
        </div>
    );
};

export const ExerciseListField = () => {
    const { control } = useFormContext();
    const { fields } = useFieldArray({
        control,
        name: "exercises",
    });

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
                        {fields.map((field: any, index) => (
                            <tr key={field.id}>
                                <td className="flex items-center gap-2 p-1">
                                    <Controller
                                        control={control}
                                        name={`exercises.${index}.selected`}
                                        render={({ field }) => (
                                            <Input
                                                id={`exercises.${index}.selected`}
                                                name={`exercises.${index}.selected`}
                                                type="checkbox"
                                                className="h-4 w-4"
                                                checked={field.value || false}
                                                onChange={(e) => {
                                                    field.onChange(e.target.checked);
                                                }}
                                            />
                                        )}
                                    />
                                    {field.name}
                                </td>
                                <td className="p-1">
                                    <Controller
                                        control={control}
                                        name={`exercises.${index}.sets`}
                                        render={({ field }) => (
                                            <Input
                                                id={`exercises.${index}.sets`}
                                                name={`exercises.${index}.sets`}
                                                type="number"
                                                min={0}
                                                value={field.value || ""}
                                                onChange={(e) => {
                                                    field.onChange(e.target.value);
                                                }}
                                            />
                                        )}
                                    />
                                </td>
                                <td className="p-1">
                                    <Controller
                                        control={control}
                                        name={`exercises.${index}.reps`}
                                        render={({ field }) => (
                                            <Input
                                                id={`exercises.${index}.reps`}
                                                name={`exercises.${index}.reps`}
                                                type="number"
                                                min={0}
                                                value={field.value || ""}
                                                onChange={(e) => {
                                                    field.onChange(e.target.value);
                                                }}
                                            />
                                        )}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
