import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useExerciseStore } from "../../entities/exercise/store"
import { toast } from "sonner";
import { Input } from "../../shared/ui/input";
import { Button } from "../../shared/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "../../shared/ui/drawer";

export const EditExercises = ({ open, setOpen, exercise }) => {
    const { editExercise, fetchExercises } = useExerciseStore();

    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        reset({ exercise: exercise?.name || "" });
    }, [exercise, reset])

    const handleEdit = async (data) => {
        try {
            await editExercise(exercise._id, { name: data.exercise.trim() })
            fetchExercises()
            toast.success("Exercise updated.")
            setOpen(false);
            reset();

        } catch (error) {
            toast.error("Unable to edit");
        }
    }

    if (!exercise) return null;

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