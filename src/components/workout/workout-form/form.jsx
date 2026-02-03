import { useState } from "react";
import { useForm } from "react-hook-form";
import { useWorkoutExerciseStore } from "../../../store/workout-exercise";
import { sanityClient } from "../../../lib/sanity";
import { Button } from "../../ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "../../ui/drawer";
import { Card, CardContent } from "../../ui/card"
import { Input } from "../../ui/input";
import { Plus, Trash2 } from "lucide-react";
import { ExerciseFieldArray } from "./fieldSet";
import { useExerciseStore } from "../../../store/excersiseStore";

export const WorkoutForms = () => {
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
                    _ref: response._id,
                    _type: "workout"
                },
                exercise: {
                    _ref: _id,
                    _type: "exercise"
                },
                plannedSets: Number(rest.plannedSets),
                plannedReps: Number(rest.plannedReps),
                _type: "workout_exercise"
            })
        })
        console.log(newExercise)

        await transaction.commit()

        setOpen(false);
        fetchWorkoutExercise();
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

                        <ExerciseList />

                        <ExerciseFieldArray control={control} register={register} setValue={setValue} />

                        <Button type="submit" >Add Workout</Button>
                    </form>

                    <Button onClick={() => setOpen(false)} variant="secondary">Close</Button>
                </DrawerContent>
            </Drawer >
        </div>
    )
}

const ExerciseList = () => {
    const { exercises } = useExerciseStore();
    const {workoutExercises}=useWorkoutExerciseStore();

    return (
        <div className="overflow-y-auto space-y-2">
            <div className="flex justify-between text-sm">
                <div className="flex font-semibold text-md"> Exercises</div>
                {exercises.length} {exercises.length <= 1 ? 'item' : 'items'}
            </div>

            {exercises.map((ex) =>
                <Card>
                    <CardContent className="flex items-center justify-between">
                        <span>{ex.name}</span>
                        <Button variant="ghost"><Trash2 /></Button>
                    </CardContent>
                </Card>
            )}
            <pre>
                {JSON.stringify(workoutExercises, null, 2)}
            </pre>
        </div>
    )
}