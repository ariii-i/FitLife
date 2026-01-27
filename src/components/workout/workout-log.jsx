import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useWorkoutLogStore } from "../../store/workout-Store";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";

export function WorkoutLog() {
    const { logs, addLogs, updateLogs } = useWorkoutLogStore();
    const { register, handleSubmit, reset } = useForm();

    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline">Add Workout</Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogTitle>Workout Form</DialogTitle>

                    <label>Workout Name</label>

                    <input
                        {...register("name")} placeholder="Workout Name"
                        className="border border-gray-900 rounded-xl px-3 py-2" />

                    <input
                        {...register("Sets")}
                        placeholder="Number of Sets"
                        type="number"
                        className="border border-gray-900 rounded-xl px-3 py-2"
                    />

                    <input
                        {...register("Reps")}
                        placeholder="Number of Reps"
                        type="number"
                        className="border border-gray-900 rounded-xl px-3 py-2"
                    />

                    <input
                        {...register("Start time")}
                        placeholder="Duration"
                        type="time"
                        className="border border-gray-900 rounded-xl px-3 py-2"
                    />

                    <Input
                        {...register("EndTime")}
                        placeholder="Weight (kg)"
                        type="number" />


                    <input
                        {...register("Weight")}
                        placeholder="Weight (kg)"
                        type="number"
                        className="border border-gray-900 rounded-xl px-3 py-2"
                    />

                    <DialogClose>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>

                    <Button type="submit">Add</Button>

                </DialogContent>



            </form>
        </Dialog>
    )
}