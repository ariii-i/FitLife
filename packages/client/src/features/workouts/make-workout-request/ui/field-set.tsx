import { useExerciseStore } from "@/entities/exercise/modal/store";
import { useEffect } from "react";
import { Control, UseFormRegister, UseFormReset, UseFormSetValue } from "react-hook-form";
import { ExerciseListField, WorkoutNameField } from "./field";
import { WorkoutFormValue } from "./form";
import z from "zod";
import { Schema_Create_Workout, Schema_Update_Workout } from "server/src/orpc-server/packages/workout/domain/schema-workout";
import { useWorkoutStore } from "@/entities/workout/modal/store";

type Props = {
    control: Control<WorkoutFormValue>;
    setValue: UseFormSetValue<WorkoutFormValue>;
    reset: UseFormReset<WorkoutFormValue>
    register: UseFormRegister<WorkoutFormValue>;
    selectedWorkout?: z.infer<typeof Schema_Create_Workout> | null
};

export const WorkoutFieldSet = ({ control, setValue, register, selectedWorkout, reset }: Props) => {
    const { workout } = useWorkoutStore()
    useEffect(() => {
        if (selectedWorkout) {
            setValue("name", selectedWorkout.name);
            setValue(
                "exercises",
                selectedWorkout.exercises.map((exercise) => {
                    return ({
                        exercise_id: exercise.exercise_id,
                        sets: exercise.sets,
                        reps: exercise.reps,
                        name: exercise.name
                    });
                })
            );
        }
    }, [selectedWorkout, setValue]);

    useEffect(() => {
        if (workout) {
            console.log("workouts",workout)
            reset({
                name: workout.name || "",
                exercises: workout.exercises?.map((ex: any) => ({
                    // _key: ex._key,
                    // id: ex.exercise?.id,
                    // name: ex.exercise?.name,
                    // selected: true,
                    sets: ex.sets,
                    reps: ex.reps,
                })) || []
            })
        }
    }, [workout, reset]);

    return (
        <div className="space-y-4">
            <pre>{JSON.stringify(workout, null, 2)}</pre>
            <WorkoutNameField register={register} />
            <ExerciseListField control={control} register={register} setValue={setValue} />
        </div>
    )
}