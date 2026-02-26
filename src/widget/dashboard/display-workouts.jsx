import { useUserStore } from "../../entities/user/store";
import { useWorkoutLogStore } from "../../entities/workout-log/store";
import { useWorkoutStore } from "../../entities/workout/store";
import { WorkoutFields } from "../../features/workouts/workout-dropdownmenu";
import { Input } from "../../shared/ui/input";

export const DisplayWorkoutList = () => {
  const { workouts } = useWorkoutStore();
  const { users } = useUserStore();
  const { updateWorkoutLog } = useWorkoutLogStore();

  return (
    <div className="space-y-4">
      <p className="font-semibold text-lg">Today's Workouts</p>

      {workouts.length === 0 && (
        <p className="text-sm text-stone-500">No workouts available</p>
      )}

      {workouts.map((workout) => (
        <div key={workout._id} className="border rounded-xl p-3 space-y-2 bg-stone-100 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-md">{workout.name}</p>
            <WorkoutFields workoutId={workout._id} />
          </div>

          <div className="space-y-1">
            {workout.exercises?.map((we) => (
              <div
                key={we._key || we._id} 
                className="flex items-center gap-3 border p-2 rounded-lg"
              >
                <Input
                  type="checkbox"
                  className="w-4 h-4"
                  onChange={async () => {
                    if (!users?._id) return;
                    await updateWorkoutLog(users._id, workout);
                  }}
                />

                <div className="flex flex-col text-sm font-semibold">
                  {we.exercise?.name}
                  <p className="text-xs text-stone-500 font-normal">
                    {we.plannedSets} sets x {we.plannedReps} reps
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};