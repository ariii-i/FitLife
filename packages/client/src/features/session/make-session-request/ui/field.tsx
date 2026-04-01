import { Input } from "@/components/ui/input"
import { Controller, useFormContext } from "react-hook-form";
import { When } from "react-if";

export const SetsField = () => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <div className="flex flex-col gap-1">
            <label className="block text-sm font-semibold"> Sets</label>
            <Controller
                control={control}
                name="sets"
                render={({ field }) => (
                    <Input
                        id="sets"
                        type="number"
                        value={field.value}
                        onChange={(e) => {
                            field.onChange(Number(e.target.value));
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

    )
}

export const RepsField = () => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <div className="flex flex-col gap-1">
            <label className="block text-sm font-semibold"> Reps</label>
            <Controller
                control={control}
                name="reps"
                render={({ field }) => (
                    <Input
                        id="reps"
                        type="number"
                        value={field.value}
                        onChange={(e) => {
                            field.onChange(Number(e.target.value));
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
    )
}