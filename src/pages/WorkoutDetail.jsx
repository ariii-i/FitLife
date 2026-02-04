import { useParams } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { useWorkoutExerciseStore } from "../store/workout-exercise";
import { useWorkoutStore } from "../store/workoutStore";
import { useEffect } from "react";

export const WorkoutDetail = () => {
  const { workoutId } = useParams();

  const { workoutExercises, fetchWorkoutExercises } =
    useWorkoutExerciseStore();
  const { workouts, fetchWorkouts } = useWorkoutStore();

  useEffect(() => {
    fetchWorkouts();
    fetchWorkoutExercises(); 
  }, []);

  const workout = workouts.find((w) => w._id === workoutId);

  const exercises = workoutExercises.filter((we) => we.workout._id === workoutId);
  console.log("ALL workoutExercises:", workoutExercises);
console.log("workoutId from URL:", workoutId);


  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">
        {workout?.name || "Workout"}
        
      </h1>

      {exercises.length === 0 ? (
        <p className="text-stone-500">No exercises added.</p>
      ) : (
        exercises.map((ex) => (
          <div
            key={ex._id}
            className="border rounded-xl p-3 mb-2 flex justify-between"
          >
            <span className="font-medium">{ex.exercise.name}</span>
            <span className="text-stone-600">
              {ex.plannedSets} sets × {ex.plannedReps} reps
            </span>
          </div>
        ))
      )}
    </Layout>
  );
};
