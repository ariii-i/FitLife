import { Plus } from "lucide-react";
import { useExerciseStore } from "../../entities/exercise/store";
import { useEffect, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Drawer, DrawerContent, DrawerTitle } from "../../components/ui/drawer";
import { sanityClient } from "../../components/lib/sanity";
import { useWorkoutStore } from "../../entities/workout/store";
import { toast } from "sonner";

export const WorkoutForm = () => {
    const { register, handleSubmit, setValue, control, watch, reset } = useForm();

    const [open, setOpen] = useState(false);
    const { fetchWorkouts, workouts, createWorkout } = useWorkoutStore();
    const { exercises } = useExerciseStore();

    const onSubmit = async (data) => {
        const selectedExercises = data.exercises.filter((ex) => ex.selected);

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
                <DrawerContent className="max-w-scree-md p-2 overflow-y-auto">
                    <DrawerTitle>Workout form</DrawerTitle>

                    <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label>Workout Name</label>
                            <Input {...register("name")} type="text" />
                        </div>

                        <ExerciseList control={control} register={register} setValue={setValue} />

                        <Button>Add Workout</Button>
                    </form>

                    <Button onClick={() => {
                        setOpen(false)
                        reset()
                    }} variant="secondary">
                        Close
                    </Button>

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
                            <tr key={field._id}>
                                <td className="flex items-center">
                                    <Input type="checkbox" className="w-4 h-4" {...register(`exercises.${index}.selected`)} />
                                    {field.name}
                                </td>
                                <td>
                                    <Input type="number" min={0} {...register(`exercises.${index}.plannedSets`)} />
                                </td>
                                <td>
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
                <div className="p-2 border rounded-xl">
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