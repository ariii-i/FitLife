import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useExerciseStore } from "@/entities/exercise/modal/store"
import { EllipsisVertical } from "lucide-react"
import { toast } from "sonner"

export const WorkoutActionMenu = () => {
    const { deleteWorkout } = useExerciseStore()
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
                    <Button type="button" variant="ghost"><EllipsisVertical /></Button>
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