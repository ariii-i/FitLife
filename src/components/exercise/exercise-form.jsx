import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { sanityClient } from "../../lib/sanity";
import { useExerciseStore } from "../../store/excersiseStore";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";

export function ExerciseForm() {
    const { addExercise } = useExerciseStore();

    const [open, setOpen] = useState(false)
    const { register, handleSubmit, reset } = useForm()

    const onSubmit = async (data) => {
        if (!data.exercise?.trim()) {
            toast.error("Exercise name is required");
            return
        }

        try {
            const created = await sanityClient.create({
                _type: "exercise",
                name: data.exercise,
            })

            addExercise(created);
            toast.success("Excercise added")
            console.log("added", created)
            reset()
            setOpen(false)
        }

        catch (err) {
            console.log("Error", err)
            toast.error("Faied to add exercise")
        }
    }

    return (
        <div>
            <Button onClick={() => setOpen(true)}><Plus /></Button>

            <Dialog open={open} onOpenChange={setOpen} >
                
                <DialogContent >
                    <DialogTitle className="font-bold text-2xl">
                        Exercises
                    </DialogTitle>

                    <form onSubmit={handleSubmit(onSubmit)} className="text-sm font-medium space-y-3">
                        <label>Exercise Name</label>
                        <Input {...register("exercise",)} placeholder="e.g. Bench Press" />
                        <Button type="submit" variant="secondary">Add </Button>
                    </form>

                    <Button onClick={()=> setOpen(false)}>Close</Button>
                </DialogContent>
            </Dialog>
        </div>
    )

}
