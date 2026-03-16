import { os } from "@orpc/server";
import * as z from "zod";
import type { IncomingHttpHeaders } from "node:http";
import { ExerciseModel } from "../domain/exercise";
import { Schema_Exercise } from "../domain/schema-exercise";

export const list_exercise = os
  .input(
    z.object({
      pageSize: z.number().int().min(1).max(100).default(10),
      pageIndex: z.number().int().min(0).default(0),
    })
  )
  .handler(async ({ input }) => {
    return await ExerciseModel.query()
      .limit(input.pageSize)
      .offset(input.pageIndex * input.pageSize);
  });
export const list_exercise_by_user = os
  .input(
    z.object({
      user_id: z.number().int(),
      pageSize: z.number().int().min(1).max(100).default(10),
      pageIndex: z.number().int().min(0).default(0),
    })
  )
  .handler(async ({ input }) => {
    return await ExerciseModel.query()
      .where("user_id", input.user_id)
      .limit(input.pageSize)
      .offset(input.pageIndex * input.pageSize);
  });

export const find_exercise = os
  .input(Schema_Exercise.pick({ id: true }))
  .handler(async ({ input }) => {
    return await ExerciseModel.query().findById(input.id);
  });

export const create_exercise = os
  .$context<{ headers: IncomingHttpHeaders }>()
  //   .use(({ context, next }) => {
  //     const user = parseJWT(context.headers.authorization?.split(" ")[1]);

  //     if (user) {
  //       return next({ context: { user } });
  //     }

  //     throw new ORPCError("UNAUTHORIZED");
  //   })
  .input(Schema_Exercise.omit({ id: true }))
  .handler(async ({ input, context }) => {
    return await ExerciseModel.query().insert(input);
  });
