import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Drawer, DrawerContent, DrawerTitle } from "../../shared/ui/drawer";
import { useExerciseStore } from "../../entities/exercise/store";
import { useWorkoutStore } from "../../entities/workout/store";
import { Input } from "../../shared/ui/input";
import { Button } from "../../shared/ui/button";

export const WorkoutForm = () => {
    const { register, handleSubmit, setValue, control, watch, reset } = useForm();

    const [open, setOpen] = useState(false);

    const onSubmit = async (data) => {
        const selectedExercises = data.exercises.filter((ex) => ex.selected);

        if (!data.name) {
            toast.error("Please enter workout name");
            return;
        }

        if (!selectedExercises.length) {
            toast.error("Select an exercise");
            return;
        }

        const workoutPayload = {
            name: data.name,
            exercises: selectedExercises.map(ex => ({
                _id: ex._id,
                plannedSets: Number(ex.plannedSets),
                plannedReps: Number(ex.plannedReps),
            })),
        };

        await useWorkoutStore.getState().createWorkout(workoutPayload, () => {
            toast.success("Excercise added")
        });

        reset();
        setOpen(false);
        await useWorkoutStore.getState().fetchWorkouts();
    };

    return (
        <div>
            <Button onClick={() => setOpen(true)}>
                <Plus />
            </Button>

            <Drawer direction="right" open={open} onOpenChange={setOpen}>
                <DrawerContent className="max-w-screen-md p-2 ">
                    <DrawerTitle>Workout form</DrawerTitle>

                    <form className="space-y-2 overflow-y-auto" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label>Workout Name</label>
                            <Input {...register("name")} type="text" />
                        </div>

                        <ExerciseList control={control} register={register} setValue={setValue} />

                        <div className="flex gap-2">
                            <Button className="w-full">Add Workout</Button>
                            <Button className="w-full" onClick={() => {
                                setOpen(false)
                                reset()
                            }} type="button">
                                Close
                            </Button>
                        </div>
                    </form>


                </DrawerContent>
            </Drawer>
        </div>
    )
}

const ExerciseList = ({ control, register, setValue }) => {
    const { exercises } = useExerciseStore()

    const { fields } = useFieldArray({
        control,
        name: "exercises",
    })

    useEffect(() => {
        if (exercises?.length) {
            setValue("exercises",
                exercises.map((ex) => ({
                    ...ex,
                    selected: false,
                    plannedSets: 0,
                    plannedReps: 0,
                }))
            )
        }
    }, [exercises, setValue])

    const watchExercises = useWatch({
        control,
        name: "exercises"
    })
    const selectedExercises = watchExercises?.filter((ex) => ex.selected) || [];

    return (
        <div className="space-y-2 ">
            <div className="border border-dashed p-1 rounded-xl border-stone-300">
                <table >
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
                                <td className="flex items-center gap-2 px-1">
                                    <Input type="checkbox" className="w-4 h-4" {...register(`exercises.${index}.selected`)} />
                                    {field.name}
                                </td>
                                <td className="px-1">
                                    <Input type="number" min={0} {...register(`exercises.${index}.plannedSets`)} />
                                </td>
                                <td className="px-1">
                                    <Input type="number" min={0} {...register(`exercises.${index}.plannedReps`)} />
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
                            {ex.name}: {ex.plannedSets} sets of {ex.plannedReps} reps
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}