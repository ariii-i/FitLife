import { create_user, find_user, list_user } from "./use-cases";

export const user = {
  list: list_user,
  find: find_user,
  create: create_user,
};
