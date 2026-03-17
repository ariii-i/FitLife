import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../components/ui/button";
import { WorkoutForm, WorkoutFormValue } from "./form";

export const WorkoutButton: React.FC = () => {
    const { register, handleSubmit, setValue, control, watch, reset } = useForm<WorkoutFormValue>();

    const [open, setOpen] = useState<boolean>(false);

    return (
        <div>
            <Button onClick={() => setOpen(true)}>
                <Plus />
            </Button>

            {open && <WorkoutForm open={open} setOpen={setOpen} />}
        </div>
    )
}