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
} from "./use-cases";

export const workout = {
  list: list_workout,
  find: find_workout,
  create: create_workout,
  list_workout_by_user,
  find_last_session_of_a_user,
  create_session,
  get_current_streak_for_a_user,
  check_if_user_has_done_workout_on_this_date,
  list_exercise_in_a_workout,
};
