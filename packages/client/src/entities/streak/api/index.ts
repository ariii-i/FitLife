import { orpc } from "@/shared/lib/orpc";

export const getStreakApi = async (
  user_id: string,
  start_date: string,
  end_date: string,
) => {
  return orpc.workout.get_streak_based_on_dates({
    user_id,
    start_date,
    end_date,
  });
};
