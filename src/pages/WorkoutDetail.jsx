import { useParams } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { useWorkoutExerciseStore } from "../store/workout-exercise";
import { useExerciseStore } from "../store/excersiseStore";
import { useWorkoutStore } from "../store/workoutStore";
import { useEffect } from "react";

export const WorkoutDetail = () => {
  const { workoutId } = useParams();

  const { exercises } = useExerciseStore();
  const { workouts, fetchWorkouts } = useWorkoutStore();
  const { workoutExercises, fetchWorkoutExercises } = useWorkoutExerciseStore();

  useEffect(()=>{
    fetchWorkouts()
    fetchWorkoutExercises()
  },[])
  const workout = workouts.filter((w) => w._id != workoutId);

  // console.log("id",workoutId)
  // console.log("id",typeof(workoutId))

  console.log("workoutss", workouts)
  console.log("WORKOUTS data", workout)
  return(
    <Layout>
      <pre>
        {JSON.stringify(workouts, null,2)}
      </pre>
      <h2>{workouts.name}</h2>
      <div>

      </div>
    </Layout>
  )
};
