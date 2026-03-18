import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useWorkoutStore } from "@/entities/workout/modal/store";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { WorkoutFieldSet } from "./field-set";
import z from "zod";
import { Schema_Create_Workout, Schema_Workout } from "server/src/orpc-server/packages/workout/domain/schema-workout";

export type PlannedValue = {
    _key?: string
    _id: string
    name: string
    sets: number
    reps: number
    selected: boolean
}

export type WorkoutFormValue = z.infer<typeof Schema_Create_Workout>

export const WorkoutForm = ({ open, setOpen }: {
    open: boolean,
    setOpen: (open: boolean) => void
}) => {
    const { createWorkout, fetchWorkouts } = useWorkoutStore()
    const { register, handleSubmit, setValue, control, watch, reset } = useForm<WorkoutFormValue>();

    const onSubmit: SubmitHandler<WorkoutFormValue> = async (data) => {

        if (!data.name) {
            return toast.error("Please enter workout name");
        }

        if (!data.exercises.length) {
            return toast.error("Please select atleast one exercise");
        }

        try {
            const payload = {
                name: data.name,
                user_id: data.user_id,
                exercises: data.exercises.map(exercise => ({
                    exercise_id: (exercise.exercise_id),
                    sets: Number(exercise.sets),
                    reps: Number(exercise.reps),
                })),
            };
            await createWorkout(payload);
            toast.success("Workout created successfully")

            reset();
            setOpen(false);
            await fetchWorkouts();
        } catch (error) {
            toast.error("Unable to create exercise.")
        }
    }

    return (
        <Drawer direction="right" open={open} onOpenChange={setOpen}>
            <DrawerContent className="max-w-screen-md p-2 ">
                <DrawerTitle>Workout form</DrawerTitle>

                <form className="space-y-2 overflow-y-auto" onSubmit={handleSubmit(onSubmit)}>
                    <WorkoutFieldSet control={control} register={register} setValue={setValue} />

                    <div className="flex gap-2">
                        <Button className="w-full" type="submit">Add Workout</Button>
                        <Button className="w-full" onClick={() => { setOpen(false) }} type="button">
                            Close
                        </Button>
                    </div>
                </form>
            </DrawerContent>
        </Drawer>
    )
}