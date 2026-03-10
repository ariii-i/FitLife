import { useUserStore } from "../../entities/user/store";
import { useWorkoutLogStore } from "../../entities/workout-log/store";
import { useWorkoutStore } from "../../entities/workout/store";
import { WorkoutFields } from "../../features/workouts/workout-dropdownmenu";
import { Input } from "../../shared/ui/input";

export const DisplayWorkoutList = () => {
  const { workouts } = useWorkoutStore();
  const { user } = useUserStore();
  const { updateWorkoutLog } = useWorkoutLogStore();

  
};