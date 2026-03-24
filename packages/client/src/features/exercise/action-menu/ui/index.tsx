import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EllipsisVertical } from "lucide-react"
import { useState } from "react"
import { Schema_Exercise } from "server/src/orpc-server/packages/exericse/domain/schema-exercise"
import z from "zod"
import { ExerciseForm } from "../../make-exercise-request/ui/form"

export const ExerciseActionMenu = ({ selectedRow }: {
    selectedRow?: z.infer<typeof Schema_Exercise>
}) => {

    const [open, setOpen] = useState(false);

    const handleEditButton = () => {
        setOpen(true);
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
                    <DropdownMenuItem onClick={() => handleEditButton()}>
                        Edit
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {open && (<ExerciseForm open={open} setOpen={setOpen} selectedExercise={selectedRow} />)}
        </div>
    )
}