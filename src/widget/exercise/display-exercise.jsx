import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../shared/ui/dropdown-menu";
import { useExerciseStore } from "../../entities/exercise/store";
import { EditExercises } from "../../features/exercise/edit-exercises";
import { Card } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";

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
            <span className="text-xs text-stone-500">{exercises.length} {exercises.length > 0 ? "exercises" : "exercise"}</span>
            {exercises.map((exercise) => (
                <div key={exercise._id} className="border-b border-dashed p-5 font-semibold flex items-center justify-between">
                    {exercise.name}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost"><EllipsisVertical /></Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleEditButton(exercise)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(exercise._id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ))}

            <EditExercises open={open} setOpen={setOpen} exercise={edit} />
        </div>
    )
}