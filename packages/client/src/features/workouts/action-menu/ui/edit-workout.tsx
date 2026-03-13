import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { useWorkoutStore } from "@/entities/workout/modal/store";
import { WorkoutFormValue } from "../../make-workout-request/ui/form";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const EditWorkout = ({ open, setOpen, }: {
    open: boolean,
    setOpen: (open: boolean) => void
}) => {
    const { workout, updateWorkout } = useWorkoutStore();
    const { register, control, handleSubmit, reset } = useForm<WorkoutFormValue>()
    const { fields } = useFieldArray<WorkoutFormValue>({
        control,
        name: "exercises",
    })

    useEffect(() => {
        if (workout) {
            reset({
                name: workout.name || "",
                exercises: workout.exercises?.map((ex:any) => ({
                    _key: ex._key,
                    _id: ex.exercise?._id,
                    name: ex.exercise?.name,
                    selected: true,
                    plannedSets: ex.plannedSets,
                    plannedReps: ex.plannedReps
                })) || []
            })
        }
    }, [workout, reset]);

    const onSubmit:SubmitHandler<WorkoutFormValue> = async (data: WorkoutFormValue) => {
        try {
            const updatedField = {
                name: data.name,
                exercises: data.exercises.map((ex) => ({
                    _type: "object",
                    _key: ex._key,
                    plannedSets: Number(ex.plannedSets),
                    plannedReps: Number(ex.plannedReps),
                    exercise: { _type: "reference", _ref: ex._id }
                }))
            }
            
            setOpen(false);

            console.log(data.exercises)
            await updateWorkout(workout._id, updatedField);
            toast.success("Workout updated successfully")
        } catch (error) {
            toast.error("Unable to update workout");
        }
    }

    return (
        <Drawer direction="right" open={open} onOpenChange={setOpen}>
            <DrawerContent className="p-2 overflow-y-auto">
                <DrawerTitle>Edit Workout</DrawerTitle>

                <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                    <Input type="text" {...register("name")} />

                    {fields.length === 0 ? (
                        <p className="text-sm text-stone-500">No exercises added</p>
                    ) : (
                        fields.map((field, index) => (
                            <div key={field.id} className="font-semibold text-sm">

                                {field.name}

                                <div className="space-y-1">
                                    <label className=" flex items-center gap-3 font-medium text-xs">
                                        Sets: <Input type="number" {...register(`exercises.${index}.plannedSets`)} />
                                    </label>
                                    <label className=" flex items-center gap-3 font-medium text-xs">Reps:
                                        <Input type="number" {...register(`exercises.${index}.plannedReps`)} />
                                    </label>
                                </div>
                            </div>
                        )))}

                    < div className="gap-2 flex">
                        <Button type="submit" className="w-full">Update</Button>

                        <Button type="button" className="w-full" onClick={() => setOpen(false)}>Cancel</Button>
                    </div>
                </form>
            </DrawerContent>
        </Drawer >
    )
}