import z from "zod";

export type T_Files = Record<string, string>;

export const Schema_Zen_Cloud_Metadata = z.object({
  tag: z.string(),
  description: z.string(),
  usage: z.string(),
});

export const Schema_Zen_Cloud = z.object({
  id: z.string().optional(),
  entry_file_name: z.string(),
  file_obj: z.record(z.string(), z.string()),
  component_name: z.string(),
  img: z.string().optional(),
  user_id: z.string().optional(),
  zen_component_id: z.string(),
  is_premium: z.boolean(),
  is_published: z.boolean(),
  metadata: Schema_Zen_Cloud_Metadata,
});

export type Type_Zen_Cloud = z.infer<typeof Schema_Zen_Cloud>;

export const Schema_Zen_Cloud_Payload = z.object({
  zen_cloud_src: Schema_Zen_Cloud,
  destination_line_number: z.number(),
  destination_file_name: z.string(),
  action_type: z.string(),
});

export type Type_Zen_Cloud_Payload = z.infer<typeof Schema_Zen_Cloud_Payload>;
