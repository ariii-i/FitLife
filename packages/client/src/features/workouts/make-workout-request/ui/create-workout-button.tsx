import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { WorkoutForm } from "./form";
import { When } from "react-if";

export const CreateWorkoutButton = () => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div>
            <Button onClick={() => { setOpen(true) }}>
                <Plus />
            </Button>

            <When condition={open}>
                <WorkoutForm open={open} setOpen={setOpen} />
            </When>
        </div>
    )
}