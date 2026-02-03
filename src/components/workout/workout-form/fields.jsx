import { EllipsisVertical, Trash2 } from "lucide-react";
import { useWorkoutExerciseStore } from "../../../store/workout-exercise"
import { useWorkoutStore } from "../../../store/workoutStore";
import { Button } from "../../ui/button"
import { useState } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "../../ui/dropdown-menu"

export const WorkoutField = () => {
    const { workouts, deleteWorkout } = useWorkoutStore();

    const onDelete = async (id) => {
        toast.warning("Are you sure you want to delete this workout?", {
            action: {
                label: "Delete",
                onClick: () => {
                    deleteWorkout(id);
                    toast.success("Workout Deleted")
                }
            }
        })
    }

    return (
        <ul className="">
            {workouts.map((w) => (
                <div className="flex justify-between items-center border-b border-stone-300">
                    <li key={w._id} className=" py-6 px-3 font-semibold text-xl">{w.name}</li>

                    {/*  */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <EllipsisVertical />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            <DropdownMenuLabel><Button variant="ghost" className="w-full justify-start">Edit</Button></DropdownMenuLabel>
                            <DropdownMenuLabel><Button variant="ghost" className="text-red-500 w-full justify-start" onClick={() => onDelete(w._id)}>Delete</Button></DropdownMenuLabel>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ))}
        </ul>
    )
}