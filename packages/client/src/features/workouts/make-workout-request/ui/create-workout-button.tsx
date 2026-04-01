import { Plus } from "lucide-react";
import { useState } from "react";
import { When } from "react-if";
import { Button } from "../../../../components/ui/button";
import { WorkoutForm } from "./form";

export const WorkoutButton = () => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div>
            <Button onClick={() => setOpen(true)} className="bg-emerald-800 hover:bg-emerald-700 hover:text-white">
                <Plus />
            </Button>

            <When condition={open}>
                <WorkoutForm open={open} setOpen={setOpen} />
            </When>
        </div>
    );
};
