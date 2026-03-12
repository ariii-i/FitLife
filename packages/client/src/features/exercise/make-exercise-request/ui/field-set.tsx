import { useEffect } from "react";
import { ExerciseField } from "./fields";
import { Exercise } from "@/entities/exercise/modal/types";

export const FieldSet = ({ register, setValue, selectedExercise }: {
    register: any,
    setValue: any
    selectedExercise?: Exercise
}) => {

    useEffect(() => {
        if (selectedExercise) {
            setValue("exercise", selectedExercise.name);
        }
    }, [selectedExercise, setValue]);
    
    return (
        <div>
            <ExerciseField register={register} />
        </div>
    )
}