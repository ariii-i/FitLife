import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { WorkoutForm } from "./form";

export const CreateWorkoutButton = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false)

    return (
        <div>
            <Button onClick={() => {
                setOpen(true)
                setEdit(false)
            }}>
                <Plus />
            </Button>

            {open && <WorkoutForm open={open} setOpen={setOpen} edit={edit} />}
        </div>
    )
}