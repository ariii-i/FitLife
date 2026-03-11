import { EllipsisVertical } from "lucide-react"
import { useState } from "react"
import { EditWorkout } from "./edit-workout"
import { useWorkoutStore } from "../../entities/workout/store"
import { toast } from "sonner"
import { Button } from "../../shared/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../shared/ui/dropdown-menu"

export const WorkoutFields = ({ workoutId }) => {
    const { fetchSelectedWorkout, deleteWorkout } = useWorkoutStore()
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(false);

    const handleEdit = async () => {
        await fetchSelectedWorkout(workoutId);
        setEditing(true);
        console.log("Fetched data", fetchSelectedWorkout)
        setOpen(true);
    }

    const handleDelete = () => {
        toast.warning("Are you sure you want to delete this workout?", {
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        await deleteWorkout(workoutId);
                        toast.success("Workout Deleted!");
                    } catch (error) {
                        toast.error("Unable to delete.");
                    }

                }
            }
        })
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button type="button" variant="ghost"><EllipsisVertical></EllipsisVertical></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {editing && <EditWorkout open={open} setOpen={setOpen} />}
        </div>
    )
}