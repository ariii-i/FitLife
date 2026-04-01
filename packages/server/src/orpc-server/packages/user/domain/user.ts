import { Model } from "objection";
import z from "zod";
import { Schema_User_Base } from "./schema-user";

export class UserModel extends Model implements z.infer<typeof Schema_User_Base> {
  id!: number;
  user_id!: string;
  username!: string;
  email!: string;
  created_at!: string;

  static tableName = "users";
}
