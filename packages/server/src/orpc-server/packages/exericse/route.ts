import { list_exercise_by_user, create_exercise, find_exercise, list_exercise, update_exercise } from "./use-cases";

export const exercise = {
  list: list_exercise,
  find: find_exercise,
  create: create_exercise,
  list_exercise_by_user,
  update_exercise
};
