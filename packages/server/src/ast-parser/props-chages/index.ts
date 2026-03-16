import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import z from "zod";
import { T_Files } from "../types";

import { pipe } from "fp-ts/function";
import { find_jsx_opening_element_by_line_number } from "../find-jsx-opening-element-by-line-number";
import { format_code } from "../format-code";
import { get_file_code_either } from "../get-file-code";
import { parse_ast } from "../parse-ast";
import { print_ast } from "../print-ast";
export const value_change = () => {};

export const Schema_Ast_Payload = z.object({
  destination_file_name: z.string(),
  destination_line_number: z.number(),
  props_name: z.string(),
  props_value: z.string(),
});

export type Type_Ast_Payload = z.infer<typeof Schema_Ast_Payload>;

const validate_payload = (payload: Type_Ast_Payload): E.Either<Error, Type_Ast_Payload> => {
  return Schema_Ast_Payload.safeParse(payload).success
    ? E.right(payload)
    : E.left(new Error("Payload validation failed."));
};

// Apply props change to a found JSXElement path. Mutates the AST in place.
export const apply_props_change_to_path =
  (payload: Type_Ast_Payload) =>
  (path: any): void => {
    const opening = path.node.openingElement;
    // ensure attributes array exists
    const props = opening.attributes ?? [];

    const props_to_change = props.find(
      (attr: any) => attr.type === "JSXAttribute" && attr.name?.name === payload.props_name
    );

    if (props_to_change) {
      // update existing attribute value
      props_to_change.value = {
        type: "StringLiteral",
        value: payload.props_value,
      };
    } else {
      // add new JSXAttribute
      props.push({
        type: "JSXAttribute",
        name: {
          type: "JSXIdentifier",
          name: payload.props_name,
        },
        value: {
          type: "StringLiteral",
          value: payload.props_value,
        },
      } as any);
    }

    // write back in case attributes was previously undefined
    opening.attributes = props;
  };

export const props_change = (
  payload: Type_Ast_Payload,
  file_obj: T_Files
): TE.TaskEither<Error, T_Files> => {
  return pipe(
    validate_payload(payload),
    TE.fromEither,
    TE.bindTo("payload"),
    TE.bind("destination_file_code", ({ payload }) =>
      TE.fromEither(get_file_code_either(payload.destination_file_name)(file_obj))
    ),
    TE.bind("destination_ast", ({ destination_file_code }) =>
      pipe(parse_ast(destination_file_code), TE.fromEither)
    ),
    TE.bind("updated_destination_ast", ({ destination_ast, payload }) =>
      TE.fromEither(
        pipe(
          find_jsx_opening_element_by_line_number(destination_ast, payload.destination_line_number),
          O.map(apply_props_change_to_path(payload)),
          O.match(
            () => E.left(new Error("No selected JSX element found")),
            () => E.right(destination_ast)
          )
        )
      )
    ),

    TE.bind("destination_code", ({ updated_destination_ast }) =>
      pipe(print_ast(updated_destination_ast), TE.fromEither)
    ),
    TE.bind("formatted_code", ({ destination_code }) => format_code(destination_code)),
    TE.map(({ payload, formatted_code }) => {
      const { destination_file_name } = payload;

      const files = {
        [destination_file_name]: formatted_code,
      } as T_Files;

      console.log(files);
      return files;
    })
  );
};
