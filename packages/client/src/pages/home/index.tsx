import { useUserStore } from "@/entities/user/modal/store";
import { useWorkoutLogStore } from "@/entities/workout-log/modal/store";
import { useWorkoutStore } from "@/entities/workout/modal/store";
import { StreaksTrack } from "@/features/streaks/ui";
import { useEffect } from "react";
import { auth } from "../../shared/lib/firebase";
import { Greetings } from "@/widget/greetings/ui";
import { WorkoutList } from "@/widget/workout/workout-list/ui";

export const HomePage = () => {
  const { fetchUser } = useUserStore();
  const { fetchWorkouts } = useWorkoutStore();
  const { fetchWorkoutLogs } = useWorkoutLogStore();

  const currentUser = auth.currentUser;
  useEffect(() => {
    if (currentUser) {
      fetchUser(currentUser.uid);
      fetchWorkoutLogs(currentUser.uid);
    }
    fetchWorkouts();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <Greetings />
      <StreaksTrack />
      <WorkoutList />
    </div>
  );
};
