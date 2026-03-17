import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ExerciseForm } from "./form";

export const AddExercises = () => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <Button onClick={() => setOpen(true)}><Plus /></Button>
            {open && <ExerciseForm open={open} setOpen={setOpen}  />}
        </div>
    )
}
