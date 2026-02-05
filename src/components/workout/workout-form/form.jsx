import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { sanityClient } from "../../../lib/sanity";
import { useExerciseStore } from "../../../store/excersiseStore";
import { useWorkoutExerciseStore } from "../../../store/workout-exercise";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Drawer, DrawerContent, DrawerTitle } from "../../ui/drawer";
import { Input } from "../../ui/input";
import { ExerciseFieldArray } from "./fieldSet";

export const WorkoutForms = () => {
    const { fetchWorkoutExercises, workoutExercises } = useWorkoutExerciseStore()
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
        const exercise = data.exercises.filter((ex) => ex.selected === true);

        const response = await sanityClient.create({
            _type: "workout",
            name: data.name
        })

        let transaction = sanityClient.transaction()
        const newExercise = exercise.forEach(({ _id, selected, name, ...rest }) => {
            transaction.create({
                ...rest,
                workout: {
                    _type: "reference",
                    _ref: response._id,
                },
                exercise: {
                    _type: "reference",
                    _ref: _id,
                },
                plannedSets: Number(rest.plannedSets),
                plannedReps: Number(rest.plannedReps),
                _type: "workout_exercise"
            })
        })
        console.log(newExercise)

        await transaction.commit()

        setOpen(false);
        fetchWorkoutExercises();
    }


    return (
        <div>
            <Button onClick={() => setOpen(true)}><Plus /></Button>

            <Drawer direction="right" className="max-w-screen-md" open={open} onOpenChange={setOpen} >
                <DrawerContent className="max-w-screen-md px-2 py-5 content-center space-y-2">
                    <DrawerTitle className="flex justify-between items-center">
                        <div>New Workout</div>
                        <Button type="button" variant="outline">Draft</Button>
                    </DrawerTitle>


                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 overflow-y-auto">
                        <div>
                            <label className="font-medium">Workout Name</label>
                            <Input {...register("name", { required: true })} type="text" placeholder="e.g. leg day" className="rounded-xl" />
                        </div>

                        {/* <ExerciseList /> */}

                        <ExerciseFieldArray control={control} register={register} setValue={setValue} />

                        <Button type="submit" >Save Workout</Button>
                    </form>

                    <Button onClick={() => setOpen(false)} variant="secondary">Close</Button>

                </DrawerContent>
            </Drawer >
        </div>
    )
}

