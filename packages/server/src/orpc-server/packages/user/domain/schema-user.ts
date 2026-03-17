import z from "zod";

export const Schema_User_Base = z.object({
  id: z.number().int().min(1),
  username: z.string(),
  email: z.string(),
  password: z.string(),
  created_at: z.string(),
});
export const Schema_User_Create = Schema_User_Base.omit({ id: true, created_at: true });
export const Schema_User_Update = Schema_User_Base.omit({ created_at: true });
