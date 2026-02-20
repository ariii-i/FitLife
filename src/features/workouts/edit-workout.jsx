import { useForm, useFieldArray } from "react-hook-form";
import { Dialog, DialogContent, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { useWorkoutStore } from "../../entities/workout/store";
import { useEffect } from "react";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

export const EditWorkout = ({ open, setOpen, }) => {
    const { workout, updateWorkout } = useWorkoutStore();
    const { register, control, handleSubmit, reset } = useForm()
    const { fields } = useFieldArray({
        control,
        name: "exercises",
    })

    useEffect(() => {
        if (workout) {
            reset({
                name: workout.name || "",
                exercises: workout.exercises?.map((ex) => ({
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

    const onSubmit = async (data) => {
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
            console.log("workout", workout)
            console.log("fields", fields)
            console.log(error.message)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>Edit Workout</DialogTitle>

                <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                    <Input type="text" {...register("name")} />

                    {fields.length === 0 ? (
                            <p className="text-sm text-gray-500">Loading exercises...</p>
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
                        <Button type="submit">Update</Button>

                        <Button type="button" onClick={() => setOpen(false)}>Cancel</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog >
    )
}