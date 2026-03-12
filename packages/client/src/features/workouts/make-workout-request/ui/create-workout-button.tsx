import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Control, SubmitHandler, useFieldArray, useForm, UseFormSetValue, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Drawer, DrawerContent, DrawerTitle } from "../../../../components/ui/drawer";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { useWorkoutStore } from "@/entities/workout/modal/store";
import { useExerciseStore } from "@/entities/exercise/modal/store";
import { WorkoutForm } from "./form";

type PlannedValue = {
    _id: string
    name: string
    plannedSets: number
    plannedReps: number
    selected: boolean
}

type WorkoutFormValue = {
    name: string
    exercises: PlannedValue[]
}

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