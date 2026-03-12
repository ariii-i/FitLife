import { Input } from "@/components/ui/input";
import { UseFormRegister } from "react-hook-form";
import { WorkoutFormValue } from "./form";

type WorkoutProps = {
    register: UseFormRegister<WorkoutFormValue>
};

export const WorkoutNameField = ({ register }: WorkoutProps) => (
    <div>
        <label>Workout Name</label>
        <Input {...register("name")} type="text" placeholder="Enter workout name" />
    </div>
);