import { useForm } from "react-hook-form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast, Toaster } from "sonner";
import { sanityClient } from "../../lib/sanity";
import { useExerciseStore } from "../../store/excersiseStore";
import { Plus } from "lucide-react";

export function ExercisePlan() {
    const { exercises, addExercise } = useExerciseStore();

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
        }

        catch (err) {
            console.log("Error", err)
            toast.error("Faied to add exercise")
        }
    }

    return (
        <Dialog>
            <div className="flex justify-between items-center">
                <DialogDescription>
                    {exercises.length} exercises
                </DialogDescription>

                <DialogTrigger asChild>
                    <Button><Plus /> Add Exercise</Button>
                </DialogTrigger>
            </div>

            <DialogContent >
                <DialogDescription className="font-bold text-2xl">
                    Exercises
                </DialogDescription>
                
                <form onSubmit={handleSubmit(onSubmit)} className="text-sm font-medium space-y-3">
                    <label>Exercise Name</label>
                    <Input {...register("exercise",)} placeholder="e.g. Bench Press" />

                    <Button type="submit" variant="outline">Add </Button>
                </form>

                <DialogClose>
                    <Button variant={"outline"}>Close</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )

}
