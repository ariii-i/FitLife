import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input"
import { useExerciseStore } from "../../entities/exercise/store";
import { toast } from "sonner";
import { sanityClient } from "../../components/lib/sanity";

export const AddExercises = () => {
    const { addExercise, fetchExercises } = useExerciseStore();

    const [open, setOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm()

    const handleAdd = async (data) => {
        if (!data.exercise?.trim()) {
            toast.error("Please enter exercies name.")
            return
        };
        try {
            const created = await sanityClient.create({
                _type: "exercise",
                name: data.exercise,
            })
            setOpen(false)
            toast.success("Exercise added!")
            addExercise(created);
            fetchExercises()
            reset()
        } catch (error) {
            toast.error("Failed to add exercise.")
        }
    }

    return (
        <div>
            <Button onClick={() => setOpen(true)}><Plus /></Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogTitle>
                        Exercise Form
                    </DialogTitle>

                    <form className="space-y-2" onSubmit={handleSubmit(handleAdd)}>
                        <Input {...register("exercise")} placeholder="e.g. Bench Press" />
                        <Button type="submit" variant="secondary">Add</Button>
                        <Button variant="secondary">Edit</Button>
                    </form>

                    <Button onClick={() => setOpen(false)}>Close</Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}

