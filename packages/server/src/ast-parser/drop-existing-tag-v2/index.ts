// LIBS
import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";

import * as fs from "fs";
import * as recast from "recast";
import * as babelParser from "recast/parsers/babel";

import {
  T_Drop_existing_tag_Payload,
  T_Files,
  T_New_Tag_Payload,
  Type_Value_Change_Payload,
  Type_Zen_Cloud,
  Type_Zen_Cloud_Payload,
} from "../types";

import { find_jsx_opening_element_by_line_number } from "../find-jsx-opening-element-by-line-number";
import { format_code } from "../format-code";

import { ACTION_TYPE_APPEND, ACTION_TYPE_INSERT_AFTER, ACTION_TYPE_INSERT_BEFORE } from "../config";
import type { namedTypes } from "ast-types";

/* ────────────────────────────────────────────────────────────── */
/* helpers                                                        */
/* ────────────────────────────────────────────────────────────── */
const b = recast.types.builders;
const n = recast.types.namedTypes;

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

const print_ast = (ast: namedTypes.File): E.Either<Error, string> =>
  E.tryCatch(
    () => recast.print(ast).code,
    (e) => (e instanceof Error ? e : new Error("Print failed"))
  );

const parse_ast = (source: string): E.Either<Error, namedTypes.File> => {
  return E.tryCatch(
    () =>
      recast.parse(source, {
        parser: babelParser, // <-- babelParser.parse exists here
      }),
    (e) => (e instanceof Error ? e : new Error("Parse failed"))
  );
};

const findOrFail = (line: number, error: string) => (ast: namedTypes.Node) =>
  pipe(
    find_jsx_opening_element_by_line_number(ast, line),
    E.fromOption(() => new Error(error))
  );

const astToCode = (ast: namedTypes.File): TE.TaskEither<Error, string> =>
  pipe(print_ast(ast), TE.fromEither, TE.chain(format_code));

/* ────────────────────────────────────────────────────────────── */
/* extract + prune                                                */
/* ────────────────────────────────────────────────────────────── */

const extractAndPrune =
  (line: number) =>
  (ast: namedTypes.File): E.Either<Error, namedTypes.Node> =>
    pipe(
      findOrFail(line, "Source JSX element not found")(ast),
      E.map((path) => {
        const cloned = recast.parse(recast.print(path.node).code).program.body[0];

        path.prune();
        return cloned;
      })
    );

/* ────────────────────────────────────────────────────────────── */
/* insert logic                                                   */
/* ────────────────────────────────────────────────────────────── */

type Inserter = (path: any, node: any) => void;

const INSERT_HANDLERS: Record<string, Inserter> = {
  [ACTION_TYPE_INSERT_BEFORE]: (p, n) => p.insertBefore(n),
  [ACTION_TYPE_INSERT_AFTER]: (p, n) => p.insertAfter(n),
  [ACTION_TYPE_APPEND]: (p, n) => p.node.children.push(n),
};

const insertAt =
  (action: string, line: number, node: any) =>
  (ast: namedTypes.File): E.Either<Error, namedTypes.File> =>
    pipe(
      findOrFail(line, "Destination JSX element not found")(ast),
      E.chain((path) => {
        const handler = INSERT_HANDLERS[action];
        if (!handler) {
          return E.left(new Error("Unsupported action type"));
        }

        handler(path, node);
        return E.right(ast);
      })
    );

/* ────────────────────────────────────────────────────────────── */
/* processing                                                     */
/* ────────────────────────────────────────────────────────────── */

const processFiles = (
  payload: T_Drop_existing_tag_Payload & {
    source_file_code: string;
    destination_file_code: string;
  },
  node: any,
  sourceAst: namedTypes.File
): TE.TaskEither<Error, T_Files> => {
  const sameFile = payload.source_file_name === payload.destination_file_name;

  return pipe(
    sameFile
      ? TE.right({ sourceAst, destinationAst: sourceAst })
      : pipe(
          format_code(payload.destination_file_code),
          TE.chainEitherK(parse_ast),
          TE.map((destinationAst) => ({ sourceAst, destinationAst }))
        ),

    TE.chain(({ sourceAst, destinationAst }) =>
      pipe(
        insertAt(
          payload.action_type as string,
          payload.destination_line_number!,
          node
        )(destinationAst),
        TE.fromEither,
        TE.map(() => ({ sourceAst, destinationAst }))
      )
    ),

    TE.chain(({ sourceAst, destinationAst }) =>
      pipe(
        astToCode(sourceAst),
        TE.bindTo("source"),
        TE.bind("destination", () => (sameFile ? TE.right(undefined) : astToCode(destinationAst))),
        TE.map(({ source, destination }) => ({
          [payload.source_file_name!]: source,
          ...(destination && {
            [payload.destination_file_name!]: destination,
          }),
        }))
      )
    )
  );
};

/* ────────────────────────────────────────────────────────────── */
/* public API                                                     */
/* ────────────────────────────────────────────────────────────── */

export const drop_existing_tag = (
  payload: T_Drop_existing_tag_Payload & {
    source_file_code: string;
    destination_file_code: string;
  }
) =>
  pipe(
    format_code(payload.source_file_code),
    TE.chainEitherK(parse_ast),

    TE.chain((sourceAst) =>
      pipe(
        extractAndPrune(payload.source_line_number!)(sourceAst),
        TE.fromEither,
        TE.chain((node) => processFiles(payload, node, sourceAst))
      )
    ),

    TE.match(console.error, (files) => {
      Object.entries(files).forEach(([name, code], idx) => {
        fs.writeFileSync(`zz-output-${idx}.jsx`, code);
      });
    })
  )();

export const drop_new_tag = (payload: T_New_Tag_Payload): TE.TaskEither<Error, T_Files> => {
  return pipe(
    format_code(payload.destination_file_code),
    TE.chainEitherK(parse_ast),

    TE.chain((destination_ast) => {
      const opening = b.jsxOpeningElement(b.jsxIdentifier(payload.tag), [], false);
      const closing = b.jsxClosingElement(b.jsxIdentifier(payload.tag));
      const children = is_text_tag(payload.tag) ? [b.jsxText(LOREM)] : [];
      const node = b.jsxElement(opening, closing, children as any);

      return pipe(
        insertAt(
          payload.action_type as string,
          payload.destination_line_number!,
          node
        )(destination_ast),
        E.chain(print_ast),
        TE.fromEither,
        TE.chain(format_code),
        TE.map((destination_source_code) => {
          return {
            [payload.destination_file_name]: destination_source_code,
          };
        })
      );
    })
  );
};

/* ────────────────────────────────────────────────────────────── */
/* zen cloud component                                            */
/* ────────────────────────────────────────────────────────────── */
const split_path = (p: string): string[] => pipe(p.split("/"), A.filter(Boolean));

/**
 * Computes the relative import path from one file to another using POSIX-style paths.
 *
 * @example
 * getRelativeImportPath("zen-components/hero.js", "components/new-component.js");
 * returns "../components/new-component.js"
 */
export const get_relative_import_path = (from_file_path: string, to_file_path: string): string => {
  const from_parts = split_path(from_file_path);
  const to_parts = split_path(to_file_path);

  // Remove file names
  const from_dir = A.init(from_parts);

  return pipe(
    from_dir,
    O.map((from) => {
      // Find common path prefix
      const common_prefix_length = pipe(
        A.zip(from, to_parts),
        A.takeLeftWhile(([a, b]) => a === b),
        A.size
      );

      const up = from.length - common_prefix_length;
      const down = A.dropLeft(common_prefix_length)(to_parts);

      const relative_path = "../".repeat(up) + down.join("/");

      return relative_path.startsWith(".") ? relative_path : "./" + relative_path;
    }),
    O.getOrElse(() => "./" + to_parts.join("/"))
  );
};

interface I_ExportAnalysis {
  hasNamedExport: boolean;
  hasDefaultExport: boolean;
}

const analyze_exports = (sourceCode: string, importIdentifier: string): I_ExportAnalysis => {
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
  analysis: I_ExportAnalysis
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

/**
 * 
 * 

phase 1 resource gathering
  prepare imports statement for zen component if not already present
  prepare the jsx element to be inserted based on usage info from zen cloud

phase 2 apply transformation
  insert the jsx element at the correct location
  insert the import statement if it was determined that it's not already present

 * @param payload 
 * @returns 
 */
export const drop_zen_component = (payload: Type_Zen_Cloud_Payload) => {
  return pipe(
    format_code(payload.zen_cloud_src.metadata.usage),
    TE.bindTo("zen_cloud_source_code"),
    TE.bind("node_to_insert", ({ zen_cloud_source_code }) =>
      pipe(parse_ast(zen_cloud_source_code), TE.fromEither)
    ),
    TE.bind("destination_ast", () => {
      return pipe(format_code(payload.destination_file_code), TE.chainEitherK(parse_ast));
    }),
    TE.bind("updated_destination_ast", ({ destination_ast, node_to_insert }) =>
      TE.fromEither(
        insertAt(
          payload.action_type as string,
          payload.destination_line_number!,
          node_to_insert
        )(destination_ast)
      )
    ),
    TE.bind("destionation_ast_with_imports", ({ updated_destination_ast }) => {
      const relative_path = get_relative_import_path(
        payload.destination_file_name,
        payload.zen_cloud_src.entry_file_name
      );
      return pipe(
        ensure_import(
          updated_destination_ast,
          payload.zen_cloud_src.metadata.tag,
          relative_path,
          payload.zen_cloud_src.file_obj[payload.zen_cloud_src.entry_file_name]
        ),
        TE.fromEither
      );
    }),
    TE.bind("destination_code", ({ destination_ast: target_ast }) =>
      pipe(print_ast(target_ast), TE.fromEither, TE.chain(format_code))
    ),
    TE.map(({ destination_code }) => {
      //  Object.keys(payload.zen_cloud_src.file_obj).forEach(([file_name, file_code]) => {

      //  });
      return {
        [payload.destination_file_name]: destination_code,
        ...payload.zen_cloud_src.file_obj,
      };
    })
  );
};

export const update_dom_value = (
  payload: Type_Value_Change_Payload
): TE.TaskEither<Error, T_Files> => {
  return pipe(
    format_code(payload.destination_file_code),
    TE.chainEitherK(parse_ast),
    TE.chain((destination_ast) => {
      return pipe(
        findOrFail(
          payload.destination_line_number,
          "Destination JSX element not found"
        )(destination_ast),
        TE.fromEither,
        TE.map((path) => {
          const jsxElement = path.node;
          const textNodeIndex = jsxElement.children.findIndex(
            (child: any) => child.type === "JSXText"
          );

          if (textNodeIndex !== -1) {
            (jsxElement.children[textNodeIndex] as any).value = payload.value;
          } else {
            // Add a new text node
            (jsxElement.children as any[]).push({
              type: "JSXText",
              value: payload.value,
            });
          }
          return destination_ast;
        })
      );
    }),
    TE.chainEitherK(print_ast),
    TE.chain(format_code),
    TE.map((destination_source_code) => ({
      [payload.destination_file_name]: destination_source_code,
    }))
  );
};
