import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUserStore } from "@/entities/user/modal/store";
import { useWorkoutLogStore } from "@/entities/workout-log/modal/store";
import { useWorkoutStore } from "@/entities/workout/modal/store";
import { WorkoutButton } from "@/features/workouts/make-workout-request/ui/create-workout-button";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { auth } from "../../shared/lib/firebase";

const getExerciseId = (
  exercise:
    | { _id: string; name: string }
    | { _type: "reference"; _ref: string },
) => {
  return "_ref" in exercise ? exercise._ref : exercise._id;
};

export const WorkoutDetails = () => {
  const { workoutId } = useParams<{ workoutId: string }>();
  const { fetchUser } = useUserStore();
  const { workoutLogs, fetchWorkoutLogs } = useWorkoutLogStore();
  const { workout, fetchSelectedWorkout } = useWorkoutStore();

  useEffect(() => {
    if (!workoutId) return;
    fetchSelectedWorkout(workoutId as any);
    if (auth.currentUser?.uid) {
      fetchUser(auth.currentUser.uid);
      fetchWorkoutLogs(auth.currentUser.uid);
    }
  }, [workoutId, fetchSelectedWorkout, fetchUser, fetchWorkoutLogs]);

  return (
    <div className="font-semibold text-xl p-2">
      {workout?.name}

      {(!workout?.exercises || workout.exercises.length === 0) && (
        <Card className="bg-stone-700 p-7 rounded-xl text-stone-100 font-semibold flex-col flex justify-center items-center text-lg">
          No exercises yet.
          <WorkoutButton />
        </Card>
      )}

      {workout?.exercises?.map((w) => {
        const exerciseId = getExerciseId(w.exercise);
        return (
          <Link key={w._key} to={`/workout/${workoutId}/session/${exerciseId}`}>
            <Card className="bg-stone-700 p-5 rounded-xl text-stone-100 font-semibold flex justify-between items-center text-lg">
              <span>{"name" in w.exercise && w.exercise.name}</span>

              <div className="font-medium text-sm text-stone-300">
                {w.plannedSets} sets x {w.plannedReps} reps
              </div>
            </Card>
          </Link>
        );
      })}

      <div className="py-2 flex justify-end">
        <Link to="/">
          <Button type="button" variant="link">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
