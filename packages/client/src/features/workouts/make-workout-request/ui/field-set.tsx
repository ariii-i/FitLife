import { useExerciseStore } from "@/entities/exercise/modal/store";
import { useWorkoutStore } from "@/entities/workout/modal/store";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ExerciseListField, WorkoutNameField } from "./field";

export const WorkoutFieldSet = ({
    selectedWorkout,
}: {
    selectedWorkout?: any;
}) => {
    const { exercises } = useExerciseStore();
    const { setValue } = useFormContext();
    const { fetchWorkoutDetail } = useWorkoutStore();

    useEffect(() => {
        const init = async () => {
            if (!exercises.length) return;

            if (selectedWorkout) {
                const res = await fetchWorkoutDetail(selectedWorkout.id);
                console.log("Workout detail:", res);

                if (res) {
                    setValue("name", res.name);

                    const mappedExercises = exercises.map((exercise) => {
                        const found = res.exercises.find(
                            (e: any) => e.exercise_id === exercise.id
                        );

                        return {
                            exercise_id: exercise.id,
                            name: exercise.name,
                            sets: found ? found.sets : 0,
                            reps: found ? found.reps : 0,
                            selected: !!found,
                        };
                    });

                    
                    setValue("exercises", mappedExercises);
                }
            } else {
                const mappedExercises = exercises.map((exercise) => ({
                    exercise_id: exercise.id,
                    name: exercise.name,
                    sets: 0,
                    reps: 0,
                    selected: false,
                }));

                setValue("exercises", mappedExercises);
            }
        };

        init();
    }, [selectedWorkout, exercises]);

    return (
        <div className="flex flex-col gap-4">
            <WorkoutNameField />
            <ExerciseListField />
        </div>
    );
};
