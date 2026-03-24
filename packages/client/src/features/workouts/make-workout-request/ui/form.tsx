import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useWorkoutStore } from "@/entities/workout/modal/store";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Schema_Create_Workout, Schema_Update_Workout } from "server/src/orpc-server/packages/workout/domain/schema-workout";
import { toast } from "sonner";
import z from "zod";
import { WorkoutFieldSet } from "./field-set";

export type PlannedValue = {
    _key?: string;
    _id: number;
    name: string;
    sets: number;
    reps: number;
    selected: boolean;
};

export type WorkoutFormValue = z.infer<typeof Schema_Create_Workout>;

export const WorkoutForm = ({ open, setOpen, edit }: {
    open: boolean,
    setOpen: (open: boolean) => void
    edit: boolean,
}) => {
    const { createWorkout, fetchWorkouts } = useWorkoutStore();
    const { updateWorkout } = useWorkoutStore();
    const methods = useForm<WorkoutFormValue>();
    const { register, handleSubmit, setValue, control, reset } = methods

    const onSubmit: SubmitHandler<WorkoutFormValue> = async (data) => {
        if (!data.name) {
            return toast.error("Please enter workout name");
        }

        if (!data.exercises.length) {
            return toast.error("Please select atleast one exercise");
        }

        if (edit) {
            try {
                const updatedField: z.infer<typeof Schema_Update_Workout> = {
                    // id: data.,
                    user_id: data.user_id,
                    name: data.name,
                    exercises: data.exercises.map((exercise) => ({
                        // _type: "object",
                        // _key: ex._key,
                        sets: Number(exercise.sets),
                        reps: Number(exercise.reps),
                        name: exercise.name,
                        exercise_id: exercise.exercise_id
                    }))
                }

                setOpen(false);
                await updateWorkout(updatedField);
                toast.success("Workout updated successfully");
                return;
            } catch (error) {
                toast.error("Unable to update workout");
            }
        }
        else {
            try {
                const payload:z.infer<typeof Schema_Create_Workout> = {
                    user_id: data.user_id,
                    name: data.name,
                    exercises: data.exercises.map(exercise => ({
                        name: exercise.name,
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
    }

    return (
        <Drawer direction="right" open={open} onOpenChange={setOpen}>
            <DrawerContent className="max-w-screen-md p-2 ">
                <DrawerTitle>Workout form</DrawerTitle>

                <FormProvider {...methods}>

                    <form className="space-y-2 overflow-y-auto" onSubmit={handleSubmit(onSubmit)}>
                        <WorkoutFieldSet control={control} register={register} setValue={setValue} reset={reset} />

                        <div className="flex gap-2">
                            {!edit ? <Button className="w-full" type="submit">Add Workout</Button> : <Button className="w-full" type="submit">Update Workout</Button>}
                            <Button className="w-full" onClick={() => { setOpen(false) }} type="button">
                                Close
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DrawerContent>
        </Drawer>
    )
}