import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Exercise } from "@/entities/exercise/modal/types"
import { EllipsisVertical } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { ExerciseForm } from "../../make-exercise-request/ui/form"
import { useExerciseStore } from "@/entities/exercise/modal/store"

export const ExerciseActionMenu = ({ selectedRow }: {
    selectedRow?: Exercise
}) => {

    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState<Exercise | null>(null)
    const { deleteExercise } = useExerciseStore()

    const handleEditButton = (data: Exercise) => {
        setEdit(data);
        setOpen(true);
    }

    const onDelete = (id: string) => {
        toast.warning("Are you sure you want to delete this exercise?", {
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        await deleteExercise(id);
                        toast.success("Exercise deleted successfully");
                    } catch {
                        toast.error("Failed to delete workout");
                    }
                }
            }
        })
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <EllipsisVertical />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={() => selectedRow && handleEditButton(selectedRow)}
                    >
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => selectedRow && onDelete(selectedRow._id)}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {open && (
                <ExerciseForm
                    open={open}
                    setOpen={setOpen}
                    selectedExercise={edit || undefined}
                />
            )}
        </div>
    )
}