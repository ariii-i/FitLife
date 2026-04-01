import { useExerciseStore } from "@/entities/exercise/modal/store";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ExerciseListField, WorkoutNameField } from "./field";
import { useWorkoutStore } from "@/entities/workout/modal/store";
export const WorkoutFieldSet = ({
    selectedWorkout,
}: {
    selectedWorkout?: any;
}) => {
    const { exercises } = useExerciseStore();
    const { setValue } = useFormContext();

    const { fetchWorkoutDetail } = useWorkoutStore();
    const init = React.useCallback(async () => {
        if (selectedWorkout) {
            const res = await fetchWorkoutDetail(selectedWorkout.id);
            console.warn(res);

            if (res) {
                setValue("name", res.name);
                setValue(
                    "exercises",
                    exercises.map((exercise) => {
                        const exercise_found = res.exercises.find(
                            (e: any) => e.id === exercise.id,
                        );

                        return {
                            exercise_id: exercise.id,
                            name: exercise.name,
                            sets: exercise_found ? exercise_found.sets : 0,
                            reps: exercise_found ? exercise_found.reps : 0,
                            selected: !!exercise_found,
                        };
                    }),
                );
            }
        }
    }, [fetchWorkoutDetail, selectedWorkout]);

    useEffect(() => {
        if (selectedWorkout) {
            init();
        } else {
            if (exercises.length) {
                setValue(
                    "exercises",
                    exercises.map((exercise) => {
                        return {
                            exercise_id: exercise.id,
                            name: exercise.name,
                            sets: 0,
                            reps: 0,
                            selected: false,
                        };
                    }),
                );
            }
        }
    }, [selectedWorkout, exercises, setValue]);

    return (
        <div className="flex flex-col gap-4 space-y-3 px-4 text-white">
            <WorkoutNameField />
            <ExerciseListField />
        </div>
    );
};
