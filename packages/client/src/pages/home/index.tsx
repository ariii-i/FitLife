import { useWorkoutStore } from "@/entities/workout/modal/store";
import { auth } from "@/shared/lib/firebase";
import { Greetings } from "@/widget/greetings/ui";
import { StreakView } from "@/widget/streak-view/ui";
import { StreakLog } from "@/widget/streak/ui/streak-log";
import { WorkoutList } from "@/widget/workout/workout-list/ui";
import { useEffect } from "react";
// import { auth } from "../../shared/lib/firebase";

export const HomePage = () => {
  // const { fetchUser } = useUserStore();
  const { fetchWorkouts } = useWorkoutStore();

  // const currentUser = auth.currentUser;
  useEffect(() => {
    fetchWorkouts({
      pageIndex: 0,
      pageSize: 100,
      user_id: auth.currentUser?.uid || "", // TODO: replace with actual user id
    });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <Greetings />
      <StreakLog />
      <StreakView />
      <WorkoutList />
    </div>
  );
};
