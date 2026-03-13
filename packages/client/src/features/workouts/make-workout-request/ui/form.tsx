import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useWorkoutStore } from "@/entities/workout/modal/store";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { WorkoutFieldSet } from "./fields";
import { WorkoutType } from "@/entities/workout/modal/types";

export type PlannedValue = {
    _key?: string
    _id: string
    name: string
    plannedSets: number
    plannedReps: number
    selected: boolean
}

export type WorkoutFormValue = {
    name: string
    exercises: PlannedValue[]
}

export const WorkoutForm = ({open, setOpen}:{
    open:boolean,
    setOpen: (open: boolean)=>void
}) => {
    const { createWorkout, fetchWorkouts } = useWorkoutStore()
    const { register, handleSubmit, setValue, control, watch, reset } = useForm<WorkoutType>();

    const onSubmit: SubmitHandler<WorkoutType> = async (data) => {
        const selectedExercises = data.exercises.filter((ex) => ex.selected);

        if (!data.name) {
            return toast.error("Please enter workout name");
        }

        if (!selectedExercises.length) {
            return toast.error("Please select atleast one exercise");
        }

        try {
            const payload = {
                name: data.name,
                exercises: selectedExercises.map(ex => ({
                    _id: ex._id,
                    plannedSets: Number(ex.plannedSets),
                    plannedReps: Number(ex.plannedReps),
                })),
            };
            await createWorkout(payload);
            toast.success("Workout created succeddfully")

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
                    <WorkoutFieldSet control={control} register={register} setValue={setValue}/>

                    <div className="flex gap-2">
                        <Button className="w-full">Add Workout</Button>
                        <Button className="w-full" onClick={() => {
                            setOpen(false)
                        }} type="button">
                            Close
                        </Button>
                    </div>
                </form>
            </DrawerContent>
        </Drawer>
    )
}