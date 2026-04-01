import {
  list_workout_by_user,
  create_workout,
  find_workout,
  list_workout,
  find_last_session_of_a_user,
  create_session,
  get_current_streak_for_a_user,
  check_if_user_has_done_workout_on_this_date,
  list_exercise_in_a_workout,
  update_workout,
  get_streak_based_on_dates,
  get_workout_history_chart_data,
} from "./use-cases";

export const workout = {
  create: create_workout,
  update: update_workout,
  list: list_workout,
  find: find_workout,
  list_workout_by_user,

  create_session,
  find_last_session_of_a_user,
  check_if_user_has_done_workout_on_this_date,

  // streak
  get_current_streak_for_a_user,
  get_streak_based_on_dates,
  list_exercise_in_a_workout,
  get_workout_history_chart_data,
};
