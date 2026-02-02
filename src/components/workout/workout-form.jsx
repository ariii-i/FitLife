import { Dumbbell, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { sanityClient } from "../../lib/sanity";
import { useExerciseStore } from "../../store/excersiseStore";
import { Button } from "../ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerTitle,
    DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";
import { useWorkoutExerciseStore } from "../../store/workout-exercise";

export function WorkoutForm() {
    const { fetchWorkoutExercise } = useWorkoutExerciseStore()
    const { register, handleSubmit, setValue, control } = useForm({
        defaultValues: {
            exercises: [{
                name: "legs",
                plannedSets: 0,
                plannedReps: 0
            }],

        }
    });

    const [open, setOpen] = useState(false);

    const onSubmit = async (data) => {
        const exercise = data.exercises.filter((ex) => ex.Selected === true);

        const response = await sanityClient.create({
            _type: "workout",
            name: data.name
        })

        let transaction = sanityClient.transaction()
        const newExercise = exercise.forEach(({ _id, Selected, name, ...rest }) => {
            transaction.create({
                ...rest,
                workout: {
                    _ref: response._id,
                    _type: "workout"
                },
                exercise: {
                    _ref: _id,
                    _type: "exercise"
                },
                plannedSets:Number(rest.plannedSets),
                plannedReps:Number(rest.plannedReps),
                _type: "workout_exercise"
            })
        })
        console.log(newExercise)

        await transaction.commit()

        setOpen(false);
        fetchworkoutExercise();
    }


    return (
        <div>
            <Button onClick={() => setOpen(true)}><Plus /></Button>
            <Drawer direction="right" className="max-w-screen-md" open={open} onOpenChange={setOpen} >

                <DrawerContent className="max-w-screen-md px-2 content-center">
                    <div>
                        <DrawerTitle>
                            Create workout plan
                        </DrawerTitle>
                        <p>
                            Build your own custom workout routines.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label>Workout Name</label>
                            <Input {...register("name", { required: true })} type="text" placeholder="e.g. leg day" />
                        </div>
                        <ExerciseFieldArray control={control} register={register} setValue={setValue} />
                        <Button type="submit">Add Workout</Button>
                    </form>
                </DrawerContent>
            </Drawer >
        </div>
    )
}

const ExerciseFieldArray = ({ control, register, setValue }) => {
    const { exercises } = useExerciseStore();

    const { fields } = useFieldArray({
        control,
        name: "exercises",
    });

    useEffect(() => {
        setValue("exercises", exercises)
    }, [exercises])

    return (
        <table >
            <tbody>
                {fields.map((field, index) => (
                    <tr className="flex gap-2 items-center">
                        <td>
                            <Input
                                key={field.id}
                                {...register(`exercises.${index}.Selected`)}
                                type="checkbox"
                            />
                        </td>
                        <td>{field.name}</td>
                        <td><Input type="number" {...register(`exercises.${index}.plannedSets`)} /></td>
                        <td><Input type="number" {...register(`exercises.${index}.plannedReps`)} /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}