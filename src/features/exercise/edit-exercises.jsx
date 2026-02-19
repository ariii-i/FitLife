import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useExerciseStore } from "../../entities/exercise/store"
import { Dialog, DialogContent, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

export const EditExercises = ({ open, setOpen, exercise }) => {
    const { editExercise } = useExerciseStore();

    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        reset({ exercise: exercise?.name || "" });
    }, [exercise, reset])

    const handleEdit = async (data) => {
        try {
            await editExercise(exercise._id, {
                name: data.exercise.trim()
            })
            toast.success("Exercise updated.")
            setOpen(false);
            reset();

        } catch (error) {
            toast.error("Unable to edit");
        }
    }

    if (!exercise) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>Edit Exercise</DialogTitle>
                <form onSubmit={handleSubmit(handleEdit)} className="space-y-2">
                    <Input type="text" {...register("exercise")} />

                    <div className="gap-2">
                        <Button type="submit" variant="ghost">Save</Button>
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
} 