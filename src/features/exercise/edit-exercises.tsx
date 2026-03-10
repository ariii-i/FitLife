import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useExerciseStore } from "@/entities/exercise/modal/store";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/ui/drawer";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Exercise } from "@/entities/exercise/modal/types";

type EditExercisesProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    exercise: Exercise | null
}

type FormValue = {
    exercise: string
}

export const EditExercises: React.FC<EditExercisesProps> = ({ open, setOpen, exercise }) => {
    const { editExercise, fetchExercises } = useExerciseStore();

    const { register, handleSubmit, reset } = useForm<FormValue>();

    useEffect(() => {
        reset({ exercise: exercise?.name || "" });
    }, [exercise, reset])

    const handleEdit: SubmitHandler<FormValue> = async (data) => {
        if (!exercise) return;

        const name = data.exercise.trim();

        if (!name) {
            toast.error("Exercise name cannot be empty");
            return;
        }

        try {
            await editExercise(exercise._id, name);
            await fetchExercises();

            toast.success("Exercise updated.");
            setOpen(false);
            reset();
        } catch (error) {
            toast.error("Unable to edit");
        }
    };

    if (!exercise) return;

    return (
        <Drawer direction="right" open={open} onOpenChange={setOpen}>
            <DrawerContent className="p-4 flex h-full flex-col">
                <DrawerTitle>Edit Exercise</DrawerTitle>

                <form onSubmit={handleSubmit(handleEdit)} className="flex-1 flex flex-col space-y-2">
                    <Input type="text" {...register("exercise")} />

                    <div className="flex-1" />

                    <div className="flex gap-2 justify-end">
                        <Button type="submit" className="w-full" >Save</Button>
                        <Button type="button" className="w-full" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </DrawerContent>
        </Drawer>
    )
} 