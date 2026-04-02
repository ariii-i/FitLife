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
            <label className="text-sm text-white">Workout Name</label>
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
                        className="w-full border-gray-700 h-8 bg-gray-800 rounded-md"
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
        <div className="space-y-4 text-white">
            {fields.map((field: any, index) => (
                <div key={field.id} className="border border-stone-700 p-4 rounded-xl">

                    <div className="flex items-center gap-2">
                        <Controller
                            control={control}
                            name={`exercises.${index}.selected`}
                            render={({ field }) => (
                                <input
                                    type="checkbox"
                                    checked={field.value || false}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                />
                            )}
                        />
                        <span className="font-medium">{field.name}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <div>
                            <label htmlFor={`exercises.${index}.sets`} className="block text-sm font-semibold">
                                Sets
                            </label>
                            <Controller
                                control={control}
                                name={`exercises.${index}.sets`}
                                render={({ field }) => (
                                    <Input
                                        id={`exercises.${index}.sets`}
                                        type="number"
                                        min={0}
                                        value={field.value || ""}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        className="w-full border-gray-700 h-8 bg-gray-800 rounded-md"
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <label htmlFor={`exercises.${index}.reps`} className="block text-sm font-semibold">
                                Reps
                            </label>
                            <Controller
                                control={control}
                                name={`exercises.${index}.reps`}
                                render={({ field }) => (
                                    <Input
                                        id={`exercises.${index}.reps`}
                                        type="number"
                                        min={0}
                                        value={field.value || ""}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        className="w-full border-gray-700 h-8 bg-gray-800 rounded-md"
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
