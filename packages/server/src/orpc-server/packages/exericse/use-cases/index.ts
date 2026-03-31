import { os } from "@orpc/server";
import * as z from "zod";
import type { IncomingHttpHeaders } from "node:http";
import { ExerciseModel } from "../domain/exercise";
import { Schema_Exercise, MuscleGroupEnum } from "../domain/schema-exercise";
import { saveBase64Image } from "../../../../utils/file-upload";

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
      name: z.string().optional(),
      muscle_group: MuscleGroupEnum.optional(),
    })
  )
  .output(z.array(Schema_Exercise))
  .handler(async ({ input }) => {
    let query = ExerciseModel.query().where("user_id", input.user_id);

    if (input.name) {
      query = query.where("name", "like", `%${input.name}%`);
    }

    if (input.muscle_group) {
      query = query.where("muscle_group", input.muscle_group);
    }

    const res = await query.limit(input.pageSize).offset(input.pageIndex * input.pageSize);
    const mapped = res.map((e) => {
      return {
        id: e.id,
        user_id: e.user_id,
        name: e.name,
        description: e.description,
        muscle_group: e.muscle_group,
        image_path: e.image_path ?? "",
      };
    });

    return mapped;
  });

export const find_exercise = os
  .input(Schema_Exercise.pick({ id: true }))
  .handler(async ({ input }) => {
    return await ExerciseModel.query().findById(input.id);
  });

export const create_exercise = os
  .$context<{ headers: IncomingHttpHeaders }>()
  .input(
    Schema_Exercise.omit({ id: true }).extend({
      image_base64: z.string().optional(),
    })
  )
  .output(Schema_Exercise)
  .handler(async ({ input }) => {
    const { image_base64, ...exerciseData } = input;
    const image_path = saveBase64Image(image_base64 || "") || undefined;

    const res = await ExerciseModel.query().insert({
      ...exerciseData,
      image_path,
    });
    const res_json = res.toJSON();
    return res_json;
  });

export const update_exercise = os
  .$context<{ headers: IncomingHttpHeaders }>()
  .input(Schema_Exercise)
  .output(Schema_Exercise)
  .handler(async ({ input }) => {
    const result = await ExerciseModel.query()
      .update(input)
      .where("id", input.id)
      .returning("*")
      .first();
    if (!result) {
      throw new Error("Exercise not found");
    }
    return {
      id: result.id,
      name: result.name,
      description: result.description,
      user_id: result.user_id,
      muscle_group: result.muscle_group,
      image_path: result.image_path,
    };
  });
