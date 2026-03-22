import { useWorkoutStore } from "../../entities/workout/modal/store";
import { WorkoutActionMenu } from "@/features/workouts/action-menu/ui";

export const DisplayWorkout = () => {
  const { workouts } = useWorkoutStore();

  return (
    <div>
      <p className="text-stone-500 text-xs">
        {workouts.length} {workouts.length <= 1 ? "workout" : "workouts"}
      </p>
      {workouts.map((workout) => (
        <div
          key={workout.id}
          className="border-b border-dashed p-5 font-semibold flex items-center justify-between"
        >
          {workout.name}
          <WorkoutActionMenu selectedWorkout={workout} />
        </div>
      ))}
    </div>
  );
};
