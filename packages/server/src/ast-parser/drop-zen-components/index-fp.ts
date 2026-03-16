// LIBS
import * as recast from "recast";
import { parse } from "recast/parsers/babel";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import * as A from "fp-ts/Array";
import * as R from "fp-ts/Record";
import { pipe, flow } from "fp-ts/function";
import * as S from "fp-ts/string";
import type { namedTypes } from "ast-types";

const { namedTypes: n, builders: b } = recast.types;

import { IConfig } from "../types";
import { ACTION_TYPE_APPEND, ACTION_TYPE_INSERT_AFTER, ACTION_TYPE_INSERT_BEFORE } from "../config";
import z from "zod";

// ============================================================================
// Types
// ============================================================================

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
  code: z.string(),
});

export type Type_Zen_Cloud = z.infer<typeof Schema_Zen_Cloud>;

export interface ZenCloud {
  id?: string;
  entry_file_name: string;
  code?: string;
  file_obj: Record<string, string>;
  tag_name: string;
  component_name: string;
  tree_content: string;
  img?: string;
  user_id: string;
  zen_component_id: string;
  is_premium: boolean;
  is_published: boolean;
}

const Schema_Zen_Cloud_Payload = z.object({
  zen_cloud_src: Schema_Zen_Cloud,
  destination_line_number: z.number(),
  destination_file_name: z.string(),
  action_type: z.string(),
});
export type Type_Zen_Cloud_Payload = z.infer<typeof Schema_Zen_Cloud_Payload>;

interface Metadata {
  description: string;
  tag_name: string;
  usage: string;
}

interface CodeObject {
  [key: string]: string;
}

interface ProcessedComponent {
  ast: namedTypes.File;
  tagName: string;
  usage: string;
  componentName: string;
  relativePath: string;
  nodeToInsert: namedTypes.Node;
  codeObject: CodeObject;
  keys: string[];
}

type ZenCloudError =
  | { type: "MISSING_DESTINATION_FILE" }
  | { type: "INVALID_CODE_OBJECT" }
  | { type: "PARSE_ERROR"; error: unknown }
  | { type: "IMPORT_ERROR"; error: unknown }
  | { type: "UNKNOWN_ERROR"; error: unknown };

// ============================================================================
// Pure utility functions
// ============================================================================

/**
 * Removes leading slash from a string
 */
const removeLeadingSlash: (str: string) => string = (str) =>
  pipe(
    str,
    O.fromPredicate((s) => S.startsWith("/")(s)),
    O.map((s) => s.slice(1)),
    O.getOrElse(() => str)
  );

/**
 * Replaces spaces with dashes
 */
const replaceSpaceWithDash = (str: string): string => str.replace(/\s/g, "-");

/**
 * Splits a path by "/" and filters out empty strings
 */
const splitPath = (p: string): string[] => pipe(p.split("/"), A.filter(Boolean));

/**
 * Computes the relative import path from one file to another using POSIX-style paths.
 *
 * @example
 * getRelativeImportPath("zen-components/hero.js", "components/new-component.js");
 * // returns "../components/new-component.js"
 */
export const getRelativeImportPath = (fromFilePath: string, toFilePath: string): string => {
  const fromParts = splitPath(fromFilePath);
  const toParts = splitPath(toFilePath);

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
 * Parses JSX code into an AST expression
 */
const parseJsxCode = (jsxCode: string): E.Either<ZenCloudError, any> =>
  E.tryCatch(
    () => {
      const ast = recast.parse(`(${jsxCode})`);
      return ast.program.body[0].expression;
    },
    (error): ZenCloudError => ({ type: "PARSE_ERROR", error })
  );

// ============================================================================
// AST manipulation functions
// ============================================================================

/**
 * Formats and converts AST to code
 */
export const formAndConvertToCode =
  (config: IConfig) =>
  (ast: any): TE.TaskEither<ZenCloudError, string> =>
    TE.tryCatch(
      async () => {
        const raw = recast.print(ast).code;
        return await config.format_fn(raw);
      },
      (error): ZenCloudError => ({ type: "UNKNOWN_ERROR", error })
    );

/**
 * Finds a JSX element in an AST by line number and applies a callback
 */
export const findJSXOpeningElementByLineNumber = (
  ast: any,
  lineNumber: number,
  cb: (params: any) => void
): void => {
  recast.visit(ast, {
    visitJSXElement(path: any) {
      const { node } = path;
      const startLine = node?.loc?.start?.line;

      if (startLine === lineNumber) {
        cb(path);
        return false;
      }

      this.traverse(path);
    },
  });
};

// ============================================================================
// Metadata extraction
// ============================================================================

/**
 * Cleans block content by removing leading asterisks
 */
const cleanBlockContent = (raw: string): string =>
  pipe(
    raw.split("\n"),
    A.map((line) => line.replace(/^\s*\*\s?/, "")),
    (lines) => lines.join("\n").trim()
  );

/**
 * Extracts a specific tag from a comment value
 */
const extractTag =
  (tagName: string) =>
  (value: string): O.Option<string> =>
    pipe(
      O.fromNullable(value.match(new RegExp(`@${tagName}\\s*\\n([\\s\\S]*)`))),
      O.chain((match) => A.lookup(1)(match)),
      O.map(cleanBlockContent)
    );

/**
 * Extracts custom JSDoc tags from provided AST comments
 */
export const extractMetadata = (ast: namedTypes.Node): Metadata => {
  const comments = ast.comments || [];
  const defaultMetadata: Metadata = {
    description: "",
    tag_name: "",
    usage: "",
  };

  return pipe(
    comments,
    A.filter((comment) => comment.type === "CommentBlock"),
    A.reduce(defaultMetadata, (acc, comment) => {
      const value = comment.value;

      return {
        description: pipe(
          extractTag("description")(value),
          O.getOrElse(() => acc.description)
        ),
        tag_name: pipe(
          extractTag("tag_name")(value),
          O.getOrElse(() => acc.tag_name)
        ),
        usage: pipe(
          extractTag("usage")(value),
          O.getOrElse(() => acc.usage)
        ),
      };
    })
  );
};

// ============================================================================
// Import management
// ============================================================================

/**
 * Checks if an import already exists
 */
const checkImportExists = (
  ast: namedTypes.Node,
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
 * Analyzes exports in source code
 */
interface ExportAnalysis {
  hasNamedExport: boolean;
  hasDefaultExport: boolean;
}

const analyzeExports = (sourceCode: string, importIdentifier: string): ExportAnalysis => {
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
 * Creates an import declaration based on export analysis
 */
const createImportDeclaration = (
  importIdentifier: string,
  importSource: string,
  analysis: ExportAnalysis
): E.Either<ZenCloudError, any> => {
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
    return E.left({
      type: "IMPORT_ERROR",
      error: new Error(
        `No named or default export found in source for identifier "${importIdentifier}"`
      ),
    });
  }
};

/**
 * Ensures an import exists in the AST
 */
const ensureImport = (
  ast: any,
  importIdentifier: string,
  importSource: string,
  sourceCode: string
): E.Either<ZenCloudError, void> => {
  if (checkImportExists(ast, importIdentifier, importSource)) {
    return E.right(undefined);
  }

  const analysis = analyzeExports(sourceCode, importIdentifier);

  return pipe(
    createImportDeclaration(importIdentifier, importSource, analysis),
    E.map((newImport) => {
      ast.program.body.unshift(newImport);
      return undefined;
    })
  );
};

// ============================================================================
// Node action mapping
// ============================================================================

const createNodeActionMap = (nodeToInsert: any): Record<string, (path: any) => void> => ({
  [ACTION_TYPE_INSERT_BEFORE]: (path: any) => {
    path.insertBefore(nodeToInsert);
  },
  [ACTION_TYPE_APPEND]: (path: any) => {
    path.node.children.push(nodeToInsert);
  },
  [ACTION_TYPE_INSERT_AFTER]: (path: any) => {
    path.insertAfter(nodeToInsert);
  },
});

// ============================================================================
// Component processing pipeline
// ============================================================================

/**
 * Parses code object from JSON string
 */
const parseCodeObject = (code: string): E.Either<ZenCloudError, CodeObject> =>
  E.tryCatch(
    () => JSON.parse(code),
    (): ZenCloudError => ({ type: "INVALID_CODE_OBJECT" })
  );

/**
 * Validates payload has required fields
 */
const validatePayload = (
  payload: Type_Zen_Cloud_Payload
): E.Either<ZenCloudError, Type_Zen_Cloud_Payload> =>
  payload.destination_file_name ? E.right(payload) : E.left({ type: "MISSING_DESTINATION_FILE" });

/**
 * Processes component metadata and paths
 */
const processComponent = (
  payload: Type_Zen_Cloud_Payload,
  config: IConfig,
  codeObject: CodeObject
): E.Either<ZenCloudError, ProcessedComponent> => {
  const { zen_cloud_src, destination_file_name } = payload;
  const { component_name: _component_name, entry_file_name } = zen_cloud_src || {};

  const keys = Object.keys(codeObject);
  const ast = config?.ast_parser_fn(destination_file_name);
  const _code = codeObject[keys[0]];

  return pipe(
    parseJsxCode(_code),
    E.map((parsedAst) => {
      const { usage: _usage, tag_name } = extractMetadata(parsedAst);
      const componentName = replaceSpaceWithDash(_component_name + "");
      const relativePath = getRelativeImportPath(
        destination_file_name,
        `zen-components/${componentName}/${entry_file_name}`
      );

      console.log({ tag_name, usage: _usage, relativePath });

      return {
        ast,
        tagName: tag_name,
        usage: _usage,
        componentName,
        relativePath,
        codeObject,
        keys,
      } as ProcessedComponent;
    }),
    E.chain((processed) =>
      pipe(
        parseJsxCode(processed.usage),
        E.map((nodeToInsert) => ({
          ...processed,
          nodeToInsert,
        }))
      )
    )
  );
};

/**
 * Applies import and node insertion
 */
const applyTransformations = (
  processed: ProcessedComponent,
  payload: Type_Zen_Cloud_Payload
): E.Either<ZenCloudError, ProcessedComponent> => {
  const { ast, tagName, relativePath, usage, nodeToInsert } = processed;
  const { action_type, destination_line_number } = payload;

  const _code = processed.codeObject[processed.keys[0]];

  return pipe(
    ensureImport(ast, tagName, relativePath, _code),
    E.map(() => {
      const actionMap = createNodeActionMap(nodeToInsert);
      findJSXOpeningElementByLineNumber(ast, destination_line_number, actionMap[action_type]);
      return processed;
    }),
    E.orElse((error) => {
      console.log("Cannot ensure imports:", error);
      // Continue even if import fails
      const actionMap = createNodeActionMap(nodeToInsert);
      findJSXOpeningElementByLineNumber(ast, destination_line_number, actionMap[action_type]);
      return E.right(processed);
    })
  );
};

/**
 * Formats code and builds final result
 */
const buildFinalResult = (
  processed: ProcessedComponent,
  payload: Type_Zen_Cloud_Payload,
  config: IConfig
): TE.TaskEither<ZenCloudError, Record<string, string>> =>
  pipe(
    formAndConvertToCode(config)(processed.ast),
    TE.map((formattedCode) => {
      const { componentName, keys, codeObject } = processed;
      const { destination_file_name } = payload;

      const componentFiles = pipe(
        keys,
        A.reduce({} as Record<string, string>, (acc, key) => ({
          ...acc,
          [`zen-components/${componentName}/${key}`]: codeObject[key],
        }))
      );

      return {
        ...componentFiles,
        [removeLeadingSlash(destination_file_name)]: formattedCode,
      };
    })
  );

// ============================================================================
// Main function
// ============================================================================

/**
 * Drops a component from zen cloud into the destination file
 */
export const drop_component_from_zen_cloud = (
  payload: Type_Zen_Cloud_Payload,
  config: IConfig
): TE.TaskEither<ZenCloudError, void> => {
  console.log("dropComponentFromZenCloud invoked");

  return pipe(
    validatePayload(payload),
    E.chain((validPayload) =>
      pipe(
        parseCodeObject(validPayload.zen_cloud_src?.code + ""),
        E.chain((codeObject) => processComponent(validPayload, config, codeObject)),
        E.chain((processed) => applyTransformations(processed, validPayload)),
        E.map((processed) => ({ processed, validPayload }))
      )
    ),
    TE.fromEither,
    TE.chain(({ processed, validPayload }) => buildFinalResult(processed, validPayload, config)),
    TE.map((result) => {
      config?.done?.(result);
      return undefined;
    }),
    TE.mapLeft((error) => {
      console.log("Error in drop_component_from_zen_cloud:", error);
      return error;
    })
  );
};

// ============================================================================
// Exports (maintaining backwards compatibility)
// ============================================================================

// Export the original function name with error handling
export const dropComponentFromZenCloud = (
  payload: Type_Zen_Cloud_Payload,
  config: IConfig
): Promise<void> =>
  pipe(
    drop_component_from_zen_cloud(payload, config),
    TE.fold(
      (error) => async () => {
        console.error("Failed to drop component:", error);
      },
      () => async () => undefined
    )
  )();
