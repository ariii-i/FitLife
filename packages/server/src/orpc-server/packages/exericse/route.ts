import {
  create_exercise,
  find_exercise,
  list_exercise,
  list_exercise_by_user,
  update_exercise,
} from "./use-cases";

export const exercise = {
  create: create_exercise,
  update_exercise,
  list_exercise_by_user,
  list: list_exercise,
  find: find_exercise,
};
