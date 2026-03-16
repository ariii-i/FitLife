// LIBS
import * as recast from "recast";

import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import { find_jsx_opening_element_by_line_number } from "../find-jsx-opening-element-by-line-number";
import { get_file_code_either } from "../get-file-code";
import { parse_ast } from "../parse-ast";
import { print_ast } from "../print-ast";
import type { namedTypes } from "ast-types";

import { ACTION_TYPE_APPEND, ACTION_TYPE_INSERT_AFTER, ACTION_TYPE_INSERT_BEFORE } from "../config";
import { T_Ast_Payload, T_Files } from "../types";

// use canonical finder from shared module

export const extract_and_prune =
  (line: number) =>
  (ast: recast.types.ASTNode): E.Either<Error, any> =>
    pipe(
      find_jsx_opening_element_by_line_number(ast, line),
      O.match(
        () => E.left(new Error("Source JSX element not found")),
        (path) => {
          const clone = JSON.parse(JSON.stringify(path.node));
          path.prune();
          return E.right(clone);
        }
      )
    );

export const insert_before =
  (node: any, line: number) =>
  (ast: recast.types.ASTNode): E.Either<Error, void> =>
    pipe(
      find_jsx_opening_element_by_line_number(ast, line),
      O.match(
        () => E.left(new Error("Destination JSX element not found")),
        (path) => {
          path.insertBefore(node);
          return E.right(undefined);
        }
      )
    );

export const insert_after =
  (node: any, line: number) =>
  (ast: recast.types.ASTNode): E.Either<Error, void> =>
    pipe(
      find_jsx_opening_element_by_line_number(ast, line),
      O.match(
        () => E.left(new Error("Destination JSX element not found")),
        (path) => {
          path.insertAfter(node);
          return E.right(undefined);
        }
      )
    );

export const insert_append =
  (node: any, line: number) =>
  (ast: recast.types.ASTNode): E.Either<Error, void> =>
    pipe(
      find_jsx_opening_element_by_line_number(ast, line),
      O.match(
        () => E.left(new Error("Destination JSX element not found")),
        (path) => {
          path.node.children.push(node);
          return E.right(undefined);
        }
      )
    );

// Perform the requested insertion on the provided AST. This helper centralises the
// action -> insertion mapping and returns the mutated AST on success.
export const perform_insert_on_ast = (
  ast: namedTypes.File,
  action: T_Ast_Payload["action_type"],
  node: any,
  destination_line: number
): E.Either<Error, namedTypes.File> =>
  pipe(
    action === ACTION_TYPE_INSERT_BEFORE
      ? insert_before(node, destination_line)(ast)
      : action === ACTION_TYPE_INSERT_AFTER
        ? insert_after(node, destination_line)(ast)
        : action === ACTION_TYPE_APPEND
          ? insert_append(node, destination_line)(ast)
          : E.left(new Error("Unsupported action type")),
    E.map(() => ast)
  );

type ValidPayload = {
  source_file_name: string;
  source_line: number;
  destination_file_name: string;
  destination_line: number;
  action: T_Ast_Payload["action_type"];
};

const validate_payload = (payload: T_Ast_Payload): E.Either<Error, ValidPayload> => {
  if (
    payload.source_file_name == null ||
    payload.destination_file_name == null ||
    payload.source_line_number == null ||
    payload.destination_line_number == null ||
    payload.action_type == null
  ) {
    return E.left(new Error("Invalid AST payload"));
  }

  return E.right({
    source_file_name: payload.source_file_name,
    source_line: payload.source_line_number,
    destination_file_name: payload.destination_file_name,
    destination_line: payload.destination_line_number,
    action: payload.action_type,
  });
};

export const drop_existing_tag =
  (payload: T_Ast_Payload) =>
  (files: T_Files): E.Either<Error, T_Files> =>
    pipe(
      validate_payload(payload), // Either<Error, ValidPayload>
      E.bindTo("valid"),
      E.bind("files", () => E.right(files)),

      // load + parse source AST
      E.bind("astSource", ({ valid, files }) =>
        pipe(
          get_file_code_either(valid.source_file_name)(files),
          E.chain(parse_ast),
          E.mapLeft(
            (err) =>
              new Error(
                `Parse failed (source: ${valid.source_file_name}): ${err?.message ?? String(err)}`
              )
          )
        )
      ),

      // extract node from source AST
      E.bind("extracted", ({ astSource, valid }) =>
        pipe(
          extract_and_prune(valid.source_line)(astSource),
          E.mapLeft(
            (err) =>
              new Error(
                `Source JSX element not found (file: ${valid.source_file_name}, line: ${valid.source_line}): ${
                  err?.message ?? String(err)
                }`
              )
          ),
          E.map((node) => ({ node, astSource }))
        )
      ),

      // ensure files exist
      E.bind("existsCheck", ({ valid, files }) =>
        valid.source_file_name in files && valid.destination_file_name in files
          ? E.right(true)
          : E.left(
              new Error(
                `Source or destination file not found (source: ${valid.source_file_name}, destination: ${valid.destination_file_name})`
              )
            )
      ),

      // perform insertion & printing; branch on same-file vs different-file
      E.bind("result", ({ valid, files, astSource, extracted }) => {
        // Use recast-based clone to preserve AST node structure instead of JSON cloning
        const nodeToInsert = recast.parse(recast.print(extracted.node as any).code);

        // same-file: insert and print single file
        if (valid.source_file_name === valid.destination_file_name) {
          return pipe(
            perform_insert_on_ast(astSource, valid.action, nodeToInsert, valid.destination_line),
            E.chain((ast) =>
              pipe(
                print_ast(ast),
                E.mapLeft(
                  (err) =>
                    new Error(
                      `Print failed (file: ${valid.source_file_name}): ${err?.message ?? String(err)}`
                    )
                ),
                E.map((code) => {
                  const updated: T_Files = { ...files };
                  updated[valid.source_file_name] = code;
                  return updated;
                })
              )
            )
          );
        }

        // different files: load+parse destination, insert, then print both
        return pipe(
          get_file_code_either(valid.destination_file_name)(files),
          E.chain(parse_ast),
          E.mapLeft(
            (err) =>
              new Error(
                `Parse failed (destination: ${valid.destination_file_name}): ${err?.message ?? String(err)}`
              )
          ),
          E.chain((astDestination) =>
            pipe(
              perform_insert_on_ast(
                astDestination,
                valid.action,
                nodeToInsert,
                valid.destination_line
              ),
              E.mapLeft(
                (err) =>
                  new Error(
                    `Insert failed (file: ${valid.destination_file_name}, action: ${String(
                      valid.action
                    )}, line: ${valid.destination_line}): ${err?.message ?? String(err)}`
                  )
              ),
              E.map(() => ({ astSource, astDestination }))
            )
          ),
          E.chain(({ astSource, astDestination }) =>
            pipe(
              print_ast(astSource),
              E.mapLeft(
                (err) =>
                  new Error(
                    `Print failed (source: ${valid.source_file_name}): ${err?.message ?? String(err)}`
                  )
              ),
              E.chain((srcCode) =>
                pipe(
                  print_ast(astDestination),
                  E.mapLeft(
                    (err) =>
                      new Error(
                        `Print failed (destination: ${valid.destination_file_name}): ${
                          err?.message ?? String(err)
                        }`
                      )
                  ),
                  E.map((dstCode) => {
                    const updated: T_Files = { ...files };
                    updated[valid.source_file_name] = srcCode;
                    updated[valid.destination_file_name] = dstCode;
                    return updated;
                  })
                )
              )
            )
          )
        );
      }),

      // return the computed result
      E.map(({ result }) => result)
    );

const sourceCode = ` 
import React from "react";
import ReactDOM from 'react-dom/client';
export const Hero = () => {
    const address="asdf"
    const person = {
        name: "JOHN",
    } 
    return <div>
        <div className="p-10 bg-green-100" ></div>
        <div className="p-10 bg-blue-100" data-selected="true">{person.name} {address}</div>
    </div>
}
  `;

const files: T_Files = {
  "component_1.jsx": sourceCode,
  "component_2.jsx": sourceCode,
};

let payload: T_Ast_Payload = {
  tag: "div",
  source_file_name: "component_1.jsx",
  source_line_number: 11,
  destination_file_name: "component_2.jsx",
  destination_line_number: 10,
  action_type: ACTION_TYPE_INSERT_BEFORE,
};

pipe(
  drop_existing_tag(payload)(files),
  E.match(
    (err) => console.error(err.message),
    (updatedFiles) => console.log(updatedFiles)
  )
);
