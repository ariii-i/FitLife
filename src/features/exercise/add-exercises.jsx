import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { useExerciseStore } from "../../entities/exercise/store";
import { toast } from "sonner";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Drawer, DrawerContent, DrawerTitle } from "../../shared/ui/drawer";

export const AddExercises = () => {
    const { createExercise, fetchExercises } = useExerciseStore();

    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { register, handleSubmit, reset } = useForm()

    const handleAdd = async (data) => {
        if (isSubmitting) return;

        if (!data.exercise?.trim()) {
            toast.error("Please enter exercies name.")
            return
        };

        try {
            setIsSubmitting(true)
            await createExercise(data);
            setOpen(false)
            toast.success("Exercise added!")
            fetchExercises()
            reset()
        } catch (error) {
            toast.error("Failed to add exercise.");
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <Button onClick={() => setOpen(true)}><Plus /></Button>

            <Drawer direction="right" open={open} onOpenChange={setOpen}>
                <DrawerContent className="p-2 h-full flex flex-col">
                    <DrawerTitle>
                        Exercises
                    </DrawerTitle>

                    <form className="space-y-2 flex flex-col flex-1" onSubmit={handleSubmit(handleAdd)}>
                        <Input {...register("exercise")} placeholder="e.g. Bench Press" />

                        <div className="flex-1" />

                        <div className="flex gap-2 justify-end w-full">
                            <Button type="submit" className="w-full" disabled={isSubmitting}>Add</Button>
                            <Button className="w-full" type="button" onClick={() => setOpen(false)}>Close</Button>
                        </div>
                        
                    </form>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

