import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { useExerciseStore } from "../../entities/exercise/store";
import { EditExercises } from "../../features/exercise/edit-exercises";
import { toast } from "sonner";

export const DisplayExercises = () => {
    const { exercises, deleteExercise } = useExerciseStore();
    const [open, setOpen] = useState(false)
    const [edit, setEdit] = useState(null)

    const handleEditButton = (data) => {
        setOpen(true);
        setEdit(data);
    }

    const onDelete = (id) => {
        toast.warning("Are you sure you want to delete this exercise?", {
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        await deleteExercise(id);
                        toast.success("Exercise deleted successfully");
                    } catch (error) {
                        toast.error("Failed to delete workout");
                    }
                }
            }
        })
    }

    if (!exercises || exercises.length === 0) {
        return (
            <div className="py-2">
                <Card className="flex flex-col items-center justify-center font-semibold p-4">
                    No exercise added.
                    <div>
                        Create a new one?
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div>
            <span className="text-xs text-gray-500">{exercises.length} {exercises.length > 0 ? "exercises" : "exercise"}</span>
            {exercises.map((ex) => (
                <div key={ex._id} className="border-b border-dashed p-5 font-semibold flex items-center justify-between">
                    {ex.name}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost"><EllipsisVertical /></Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleEditButton(ex)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(ex._id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ))}

            <EditExercises open={open} setOpen={setOpen} exercise={edit} />
        </div>
    )
}