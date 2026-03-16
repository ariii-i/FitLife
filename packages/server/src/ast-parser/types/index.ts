import z from "zod";

export type T_Files = Record<string, string>;

export type T_Action_Type = "reorder-above" | "make-child" | "reorder-below";

export type T_Ast_Payload = {
  source_file_name?: string;
  source_line_number?: number;
  destination_file_name: string;
  destination_line_number: number;
  action_type?: T_Action_Type;
  tag: string;
};

export type T_Drop_existing_tag_Payload = T_Ast_Payload & {
  source_file_code: string;
  destination_file_code: string;
};

export type T_New_Tag_Payload = Pick<
  T_Ast_Payload,
  "destination_file_name" | "destination_line_number" | "action_type" | "tag"
> & {
  destination_file_code: string;
};

export type T_NewTag_Payload = Omit<T_Ast_Payload, "source_file_name" | "source_line_number"> & {
  attributes?: Record<string, string>;
};
export type T_Zen_Payload = Omit<T_Ast_Payload, "source_file_name" | "source_line_number"> & {
  entry_path: string; // e.g. "components/index.jsx"
  zen_cloud_src: Record<string, string>; // map from repo-root-relative path -> code
};

export type Type_Value_Change_Payload = Pick<
  T_Ast_Payload,
  "destination_file_name" | "destination_line_number"
> & {
  destination_file_code: string;
  value: string;
};

export interface IConfig {
  ast_parser_fn: (file_name: string) => any;
  format_fn: (code: string) => any;

  writer_fn?: ((file_name: string, code: string) => any) | any;
  writer_fn_v3?: (params: { [file_name: string]: string }) => void;
  writer_fn_v2?: (params: {
    source: {
      file_name: string;
      code: string;
    };
    destination: {
      file_name: string;
      code: string;
    };
  }) => void;
  // writer_fn_v3?: (params: { file_name: string; code: string }[]) => void;
  done?: (data: any) => void;
}

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
  destination_file_code: z.string(),
  action_type: z.string(),
});

export type Type_Zen_Cloud_Payload = z.infer<typeof Schema_Zen_Cloud_Payload>;
