// LIBS
import * as recast from "recast";

import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { get_file_code_either } from "../get-file-code";
import { parse_ast } from "../parse-ast";
import { print_ast } from "../print-ast";
import { perform_insert_on_ast } from "../drop-existing-tag";

import { ACTION_TYPE_APPEND, ACTION_TYPE_INSERT_AFTER, ACTION_TYPE_INSERT_BEFORE } from "../config";
import { T_Files, T_Ast_Payload, T_NewTag_Payload } from "../types";

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

const TEXT_TAGS = new Set([
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "blockquote",
  "figcaption",
  "label",
  "span",
]);

export const is_text_tag = (tag: string): boolean => TEXT_TAGS.has(tag.toLowerCase());

const validate_payload = (
  payload: T_NewTag_Payload
): E.Either<
  Error,
  {
    tag: string;
    attributes?: Record<string, string>;
    destination_file_name: string;
    destination_line: number;
    action: T_Ast_Payload["action_type"];
  }
> => {
  if (
    !payload ||
    payload.tag == null ||
    payload.destination_file_name == null ||
    payload.destination_line_number == null ||
    payload.action_type == null
  ) {
    return E.left(new Error("Invalid payload"));
  }

  return E.right({
    tag: payload.tag,
    attributes: payload.attributes,
    destination_file_name: payload.destination_file_name,
    destination_line: payload.destination_line_number,
    action: payload.action_type,
  });
};

// helpers for insertion - reuse finder logic from other file
const b = recast.types.builders;

export const drop_new_tag =
  (payload: T_NewTag_Payload) =>
  (files: T_Files): E.Either<Error, T_Files> =>
    pipe(
      validate_payload(payload),
      E.bindTo("valid"),
      E.bind("files", () => E.right(files)),

      // ensure destination file exists
      E.bind("exists", ({ valid, files }) =>
        valid.destination_file_name in files
          ? E.right(true)
          : E.left(new Error(`Destination file not found: ${valid.destination_file_name}`))
      ),

      // load + parse destination AST
      E.bind("astDestination", ({ valid, files }) =>
        pipe(
          get_file_code_either(valid.destination_file_name)(files),
          E.chain(parse_ast),
          E.mapLeft(
            (err) =>
              new Error(
                `Parse failed (destination: ${valid.destination_file_name}): ${err?.message ?? String(err)}`
              )
          )
        )
      ),

      E.bind("result", ({ valid, files, astDestination }) => {
        // build node
        const attrs = (valid.attributes ? Object.entries(valid.attributes) : []).map(([k, v]) =>
          b.jsxAttribute(b.jsxIdentifier(k), b.literal(v))
        );

        const opening = b.jsxOpeningElement(b.jsxIdentifier(valid.tag), attrs, false);
        const closing = b.jsxClosingElement(b.jsxIdentifier(valid.tag));
        const children = is_text_tag(valid.tag) ? [b.jsxText(LOREM)] : [];
        const node = b.jsxElement(opening, closing, children as any);

        // perform insert using the shared functional helper
        return pipe(
          perform_insert_on_ast(astDestination, valid.action, node as any, valid.destination_line),
          E.mapLeft(
            (err) =>
              new Error(
                `Insert failed (file: ${valid.destination_file_name}, action: ${String(
                  valid.action
                )}, line: ${valid.destination_line}): ${err?.message ?? String(err)}`
              )
          ),
          E.chain((ast) =>
            pipe(
              print_ast(ast),
              E.mapLeft(
                (err) =>
                  new Error(
                    `Print failed (file: ${valid.destination_file_name}): ${err?.message ?? String(err)}`
                  )
              ),
              E.map((code) => {
                const updated: T_Files = { ...files };
                updated[valid.destination_file_name] = code;
                return updated;
              })
            )
          )
        );
      }),

      E.map(({ result }) => result)
    );
