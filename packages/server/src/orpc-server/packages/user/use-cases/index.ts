import { ORPCError, os } from "@orpc/server";
import type { IncomingHttpHeaders } from "node:http";
import * as z from "zod";
import { Schema_User_Base, Schema_User_Create } from "../domain/schema-user";
import { UserModel } from "../domain/user";

export const list_user = os
  .input(
    z.object({
      pageSize: z.number().int().min(1).max(100).default(10),
      pageIndex: z.number().int().min(0).default(0),
    })
  )
  .handler(async ({ input }) => {
    const res = await UserModel.query()
      .limit(input.pageSize)
      .offset(input.pageIndex * input.pageSize);
    return res;
  });

export const find_user = os
  .input(Schema_User_Base.pick({ id: true }))
  .handler(async ({ input }) => {
    const user = await UserModel.query().findById(input.id);
    if (!user) {
      throw new ORPCError("User not found");
    }
    return user;
  });

export const create_user = os
  .$context<{ headers: IncomingHttpHeaders }>()
  .input(Schema_User_Create)
  .handler(async ({ input, context }) => {
    return await UserModel.query().insert(input);
  });
