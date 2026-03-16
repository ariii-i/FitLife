import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";

import type { namedTypes } from "ast-types";
import * as recast from "recast";

import { perform_insert_on_ast } from "../drop-existing-tag";
import { get_file_code_either } from "../get-file-code";
import { parse_ast } from "../parse-ast";
import { print_ast } from "../print-ast";
import { format_code } from "../format-code";

import { T_Action_Type } from "../types";
import { Schema_Zen_Cloud_Payload, T_Files, Type_Zen_Cloud_Payload } from "./types";

const { namedTypes: n, builders: b } = recast.types;

const split_path = (p: string): string[] => pipe(p.split("/"), A.filter(Boolean));

/**
 * Computes the relative import path from one file to another using POSIX-style paths.
 *
 * @example
 * getRelativeImportPath("zen-components/hero.js", "components/new-component.js");
 * // returns "../components/new-component.js"
 */
export const get_relative_import_path = (fromFilePath: string, toFilePath: string): string => {
  const fromParts = split_path(fromFilePath);
  const toParts = split_path(toFilePath);

  // Remove file names
  const fromDir = A.init(fromParts);

  return pipe(
    fromDir,
    O.map((from) => {
      // Find common path prefix
      const commonPrefixLength = pipe(
        A.zip(from, toParts),
        A.takeLeftWhile(([a, b]) => a === b),
        A.size
      );

      const up = from.length - commonPrefixLength;
      const down = A.dropLeft(commonPrefixLength)(toParts);

      const relativePath = "../".repeat(up) + down.join("/");

      return relativePath.startsWith(".") ? relativePath : "./" + relativePath;
    }),
    O.getOrElse(() => "./" + toParts.join("/"))
  );
};

/**
 * Analyzes exports in source code
 */
interface ExportAnalysis {
  hasNamedExport: boolean;
  hasDefaultExport: boolean;
}

/**
 * Checks if an import already exists
 */
const check_imports_exists = (
  ast: namedTypes.File,
  importIdentifier: string,
  importSource: string
): boolean => {
  let exists = false;

  recast.visit(ast, {
    visitImportDeclaration(path) {
      const node = path.node;
      if (node.source.value === importSource) {
        for (const specifier of node.specifiers || []) {
          if (
            (n.ImportSpecifier.check(specifier) && specifier.imported.name === importIdentifier) ||
            (n.ImportDefaultSpecifier.check(specifier) &&
              specifier.local &&
              specifier.local.name === importIdentifier)
          ) {
            exists = true;
            return false;
          }
        }
      }
      this.traverse(path);
    },
  });

  return exists;
};

/**
 * Creates an import declaration based on export analysis
 */
const create_import_declaration = (
  importIdentifier: string,
  importSource: string,
  analysis: ExportAnalysis
): E.Either<Error, any> => {
  if (analysis.hasNamedExport) {
    return E.right(
      b.importDeclaration(
        [b.importSpecifier(b.identifier(importIdentifier))],
        b.literal(importSource)
      )
    );
  } else if (analysis.hasDefaultExport) {
    return E.right(
      b.importDeclaration(
        [b.importDefaultSpecifier(b.identifier(importIdentifier))],
        b.literal(importSource)
      )
    );
  } else {
    return E.left(
      new Error(`No named or default export found in source for identifier "${importIdentifier}"`)
    );
  }
};

const analyze_exports = (sourceCode: string, importIdentifier: string): ExportAnalysis => {
  const sourceAst = recast.parse(sourceCode);
  let hasNamedExport = false;
  let hasDefaultExport = false;

  recast.visit(sourceAst, {
    visitExportNamedDeclaration(path) {
      const node = path.node;

      if (node.declaration) {
        if (
          n.FunctionDeclaration.check(node.declaration) &&
          node.declaration.id?.name === importIdentifier
        ) {
          hasNamedExport = true;
        }
        if (
          n.ClassDeclaration.check(node.declaration) &&
          node.declaration.id?.name === importIdentifier
        ) {
          hasNamedExport = true;
        }
        if (n.VariableDeclaration.check(node.declaration)) {
          for (const decl of node.declaration.declarations) {
            if (
              n.VariableDeclarator.check(decl) &&
              // @ts-expect-error
              decl.id.name === importIdentifier
            ) {
              hasNamedExport = true;
            }
          }
        }
      }

      if (node.specifiers) {
        for (const spec of node.specifiers) {
          if (spec.exported.name === importIdentifier) {
            hasNamedExport = true;
          }
        }
      }

      this.traverse(path);
    },
    visitExportDefaultDeclaration(path) {
      hasDefaultExport = true;
      this.traverse(path);
    },
  });

  return { hasNamedExport, hasDefaultExport };
};

/**
 * Ensures an import exists in the AST
 */
export const ensure_import = (
  ast: namedTypes.File, // destinaation ast
  importIdentifier: string, // import name
  importSource: string, // import to be added
  sourceCode: string // zen component source code
): E.Either<Error, namedTypes.File> => {
  if (check_imports_exists(ast, importIdentifier, importSource)) {
    return E.right(ast);
  }

  const analysis = analyze_exports(sourceCode, importIdentifier);

  return pipe(
    create_import_declaration(importIdentifier, importSource, analysis),
    E.map((newImport) => {
      ast.program.body.unshift(newImport);
      return ast;
    })
  );
};

const validate_payload = (
  payload: Type_Zen_Cloud_Payload
): E.Either<Error, Type_Zen_Cloud_Payload> => {
  return Schema_Zen_Cloud_Payload.safeParse(payload).success
    ? E.right(payload)
    : E.left(new Error("Payload validation failed."));
};

export const drop_component_from_zen_cloud = (
  payload: Type_Zen_Cloud_Payload,
  file_obj: T_Files
): TE.TaskEither<Error, T_Files> => {
  return pipe(
    validate_payload(payload),
    TE.fromEither,
    TE.bindTo("payload"),
    TE.bind("zen_cloud_source_code", ({ payload }) =>
      TE.fromEither(
        get_file_code_either(payload.zen_cloud_src.entry_file_name)(payload.zen_cloud_src.file_obj)
      )
    ),
    TE.bind("node_to_insert", ({ payload }) =>
      pipe(parse_ast(payload.zen_cloud_src.metadata.usage), TE.fromEither)
    ),
    TE.bind("destination_file_code", ({ payload }) =>
      TE.fromEither(get_file_code_either(payload.destination_file_name)(file_obj))
    ),
    TE.bind("destination_ast", ({ destination_file_code }) =>
      pipe(parse_ast(destination_file_code), TE.fromEither)
    ),
    TE.bind("updated_destination_ast", ({ destination_ast, node_to_insert, payload }) =>
      TE.fromEither(
        perform_insert_on_ast(
          destination_ast,
          payload.action_type as T_Action_Type,
          node_to_insert,
          payload.destination_line_number
        )
      )
    ),
    TE.bind("ensure_import_done", ({ updated_destination_ast, payload, zen_cloud_source_code }) => {
      const relative_path = get_relative_import_path(
        payload.destination_file_name,
        payload.zen_cloud_src.entry_file_name
      );
      return pipe(
        ensure_import(
          updated_destination_ast,
          payload.zen_cloud_src.metadata.tag,
          relative_path,
          zen_cloud_source_code
        ),
        TE.fromEither
      );
    }),
    TE.bind("destination_code", ({ ensure_import_done }) =>
      pipe(print_ast(ensure_import_done), TE.fromEither)
    ),
    TE.bind("formatted_code", ({ destination_code }) => format_code(destination_code)),
    TE.map(({ payload, formatted_code }) => {
      const {
        destination_file_name,
        zen_cloud_src: { entry_file_name, file_obj },
      } = payload;
      const files = {
        [destination_file_name]: formatted_code,
        [entry_file_name]: file_obj[entry_file_name],
      } as T_Files;
      console.log("FILES", files);
      return files;
    })
  );
};
