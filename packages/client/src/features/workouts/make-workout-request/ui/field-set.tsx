import { Control, UseFormRegister, UseFormSetValue, useForm } from "react-hook-form";
import { WorkoutFormValue } from "./form";
import { useExerciseStore } from "@/entities/exercise/modal/store";
import { useEffect } from "react";
import { WorkoutNameField } from "./workout-field";
import { ExerciseListField } from "./exercise-field";

type Props = {
    control: Control<WorkoutFormValue>;
    setValue: UseFormSetValue<WorkoutFormValue>;
    register: UseFormRegister<WorkoutFormValue>
};

export const WorkoutFieldSet = ({ control, setValue, register }: Props) => {
    const { exercises } = useExerciseStore();

    useEffect(() => {
        if (exercises.length) {
            setValue(
                "exercises",
                exercises.map((ex) => ({
                    ...ex,
                    selected: false,
                    plannedSets: 0,
                    plannedReps: 0,
                }))
            );
        }
    }, [exercises, setValue]);

    return (
        <div className="space-y-4">
            <WorkoutNameField register={register} />
            <ExerciseListField control={control} register={register} setValue={setValue} />
        </div>
    )
}