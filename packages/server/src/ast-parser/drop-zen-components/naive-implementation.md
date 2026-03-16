```ts
// LIBS
import * as recast from "recast";
import { parse } from "recast/parsers/babel";

const { namedTypes: n, builders: b } = recast.types;

// import { parse as babelParse } from "recast/parsers/babel";
import { IConfig } from "../types";
import { ACTION_TYPE_APPEND, ACTION_TYPE_INSERT_AFTER, ACTION_TYPE_INSERT_BEFORE } from "../config";

export async function formAndConvertToCode(ast: any, config: IConfig): Promise<string> {
  const raw = recast.print(ast).code;
  return await config.format_fn(raw);
}
/**
 * Computes the relative import path from one file to another using POSIX-style paths.
 *
 * @example
 * getRelativeImportPath("zen-components/hero.js", "components/new-component.js");
 * // returns "../components/new-component.js"
 *
 * @param fromFilePath - Path of the importing file (e.g., "zen-components/hero.js").
 * @param toFilePath - Path of the file being imported (e.g., "components/new-component.js").
 * @returns A relative path string (e.g., "../components/new-component.js").
 */
export function getRelativeImportPath(fromFilePath: any, toFilePath: any) {
  const splitPath = (p: string) => p.split("/").filter(Boolean);

  const fromParts = splitPath(fromFilePath);
  const toParts = splitPath(toFilePath);

  // Remove file names
  fromParts.pop();

  // Find common path prefix
  let i = 0;
  while (i < fromParts.length && i < toParts.length && fromParts[i] === toParts[i]) {
    i++;
  }

  const up = fromParts.length - i;
  const down = toParts.slice(i);

  let relativePath = "../".repeat(up) + down.join("/");

  if (!relativePath.startsWith(".")) relativePath = "./" + relativePath;

  return relativePath;
}

/**
 * Computes the relative import path from one file to another using POSIX-style paths.
 *
 * @example
 * getRelativeImportPath("zen-components/hero.js", "components/new-component.js");
 * // returns "../components/new-component.js"
 *
 * @param fromFilePath - Path of the importing file (e.g., "zen-components/hero.js").
 * @param toFilePath - Path of the file being imported (e.g., "components/new-component.js").
 * @returns A relative path string (e.g., "../components/new-component.js").
 */
export function getRelativeImportPathV2(fromFilePath: any, toFilePath: any) {
  const splitPath = (p: string) => p.split("/").filter(Boolean);

  const fromParts = splitPath(fromFilePath);
  const toParts = splitPath(toFilePath);

  // Remove file names
  fromParts.pop();

  // Find common path prefix
  let i = 0;
  while (i < fromParts.length && i < toParts.length && fromParts[i] === toParts[i]) {
    i++;
  }

  const up = fromParts.length - i;
  const down = toParts.slice(i);

  let relativePath = "../".repeat(up) + down.join("/");

  if (!relativePath.startsWith(".")) relativePath = "./" + relativePath;

  return relativePath;
}

/**
 * Finds a JSX element in an AST by line number.
 *
 * @param {Object} ast - The abstract syntax tree to search.
 * @param {number} lineNumber - The line number to search for.
 * @param {function} [cb] - If provided, this function will be called with the
 *   {@link NodePath} of the found element. If the callback returns a truthy value,
 *   traversal will stop and the found element will be returned.
 *
 * @returns {Object|null} The found element, or `null` if no element was found.
 */
export const findJSXOpeningElementByLineNumber = (
  ast: any,
  lineNumber: any,
  cb?: (params: any) => void
) => {
  recast.visit(ast, {
    visitJSXElement(path: any) {
      const { node } = path;

      // Check if the node's start line number matches the target line number
      const startLine = node?.loc?.start?.line;
      if (startLine === lineNumber) {
        cb?.(path);
        return false; // Stop traversing once found
      }

      // check for data-selected="true"
      // const attributeExists = node.openingElement.attributes.some(
      //   (attr: any) => attr.name && attr.name.name === "data-selected"
      // );

      // if (attributeExists) {
      //   cb?.(path);
      //   return false;
      // }

      this.traverse(path);
    },
  });
};

export interface ZenCloud {
  id?: string;
  entry_file_name: string;
  code: string;
  tag_name: string;
  // this is tree content for component
  component_name: string;
  tree_content: string;
  img?: string;
  user_id: string;
  zen_component_id: string;
  is_premium: boolean;
  is_published: boolean;
}

export interface IZendCloudPayload {
  zen_cloud_src: Partial<ZenCloud>;
  destination_line_number: number;
  destination_file_name: string;
  action_type: string;
}

const removeLeadingSlash = (str: string) => {
  if (str.startsWith("/")) return str.slice(1);
  return str;
};
const replace_space_wqith_dash = (str: string) => str.replace(/\s/g, "-");
export const drop_component_from_zen_cloud = async (
  payload: IZendCloudPayload,
  config: IConfig
) => {
  try {
    console.log("dropComponentFromZenCloud invoked");

    const { zen_cloud_src, action_type, destination_file_name, destination_line_number } = payload;

    if (!destination_file_name) {
      return;
    }

    const { code, component_name: _component_name, entry_file_name } = zen_cloud_src || {};

    const code_object = JSON.parse(code + "");

    if (!code_object) return;

    const keys = Object.keys(code_object);

    const ast = config?.ast_parser_fn(destination_file_name);

    const _code = code_object[keys[0]];

    const { usage: _usage, tag_name } = extractMetadata(parse(_code));

    console.log({
      tag_name,
      i: _usage,
    });
    const component_name = replace_space_wqith_dash(_component_name + "");
    const relative_path = getRelativeImportPath(
      `${destination_file_name}`,
      `zen-components/${component_name}/${entry_file_name}`
    );

    console.log("relative_path: ", relative_path);

    try {
      ensureImport(ast, tag_name, relative_path, _code);
    } catch (error) {
      console.log("cannot ensure imports: ", error);
    }

    console.log("_usage", _usage);
    const node_to_insert = parseJsxCode(_usage);

    const node_action_based_on_action_type: Record<string, (path: any) => void> = {
      [ACTION_TYPE_INSERT_BEFORE]: (path: any) => {
        path.insertBefore(node_to_insert);
      },
      [ACTION_TYPE_APPEND]: (path: any) => {
        path.node.children.push(node_to_insert);
      },
      [ACTION_TYPE_INSERT_AFTER]: (path: any) => {
        path.insertAfter(node_to_insert);
      },
    };

    findJSXOpeningElementByLineNumber(
      ast,
      destination_line_number,
      node_action_based_on_action_type[action_type]
    );

    const formatted_destination_code = await formAndConvertToCode(ast, config);
    // const formated_new_component_code = await config?.format_fn(code);

    // we nned to expect zen cloud component code to be record of filename and code, with index as entry point
    // parse the metadata from entry file and add the supporting files into code object

    let done_data: Record<string, string> = {};

    for (const key of keys) {
      const code = code_object[key];
      done_data[`zen-components/${component_name}/${key}`] = code;
    }

    done_data[removeLeadingSlash(destination_file_name)] = formatted_destination_code;

    config?.done?.(done_data);
  } catch (error) {
    console.log("error in drop_component_from_zen_cloud: ", error);
  }
};

/**
 * source code = zen component code
 * destination code = current file code
 *
 * check if import exists or not (default or named export)
 * if not:
 *   check if source code has named export or not; if not, check for default export
 *   prefer named export
 * and update the import path on destination code accordingly
 * @param ast destination AST
 * @param importIdentifier identifier to import
 * @param importSource path to source file (relative)
 * @param sourceCode source file code content (string)
 */
function ensureImport(
  ast: any,
  importIdentifier: string,
  importSource: string,
  sourceCode: string
) {
  let importExists = false;

  // Check if import already exists
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
            importExists = true;
            return false; // Stop visiting
          }
        }
      }
      this.traverse(path);
    },
  });

  if (importExists) {
    return; // Already imported, nothing to do
  }

  // Parse source code to analyze exports
  const sourceAst = recast.parse(sourceCode, {
    // parser: require("recast/parsers/typescript"),
  });

  let hasNamedExport = false;
  let hasDefaultExport = false;

  recast.visit(sourceAst, {
    visitExportNamedDeclaration(path) {
      const node = path.node;

      // Check if directly declared export
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

      // Check if exported from specifiers
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

  let newImport;
  if (hasNamedExport) {
    newImport = b.importDeclaration(
      [b.importSpecifier(b.identifier(importIdentifier))],
      b.literal(importSource)
    );
  } else if (hasDefaultExport) {
    newImport = b.importDeclaration(
      [b.importDefaultSpecifier(b.identifier(importIdentifier))],
      b.literal(importSource)
    );
  } else {
    throw new Error(
      `No named or default export found in source for identifier "${importIdentifier}"`
    );
  }

  // Insert import at top
  ast.program.body.unshift(newImport);
}

// /**
//  * Extracts the content inside @usage JSDoc block from given code
//  * @param {string} code - The code to parse
//  * @returns {string|null} - The usage content or null if not found
//  */
// export function extractUsage(ast) {
//   // Check all comments in the program
//   const comments = ast.comments || [];
//   for (const comment of comments) {
//     if (comment.type === "CommentBlock" && comment.value.includes("@usage")) {
//       // Extract everything after @usage
//       const usageMatch = comment.value.match(/@usage\s*\n([\s\S]*)/);
//       if (usageMatch && usageMatch[1]) {
//         // Trim leading/trailing whitespace
//         return usageMatch[1].trim();
//       }
//     }
//   }

//   return null;
// }

/**
 * Extracts custom JSDoc tags from provided AST comments
 * @param {object} ast - The parsed AST (from recast.parse)
 * @returns {{
 *   description: string | null,
 *   tag_name: string | null,
 *   usage: string | null
 * }}
 */
export function extractMetadata(ast: any) {
  const result = {
    description: "",
    tag_name: "",
    usage: "",
  };

  const comments = ast.comments || [];
  for (const comment of comments) {
    if (comment.type === "CommentBlock") {
      const value = comment.value;

      // Helper to clean content: remove leading '*'
      function cleanBlockContent(raw: string) {
        return raw
          .split("\n")
          .map((line) => line.replace(/^\s*\*\s?/, "")) // Remove leading "* " or "*"
          .join("\n")
          .trim();
      }

      // Extract @description
      if (value.includes("@description")) {
        const match = value.match(/@description\s*\n([\s\S]*)/);
        if (match && match[1]) {
          result.description = cleanBlockContent(match[1]);
        }
      }

      // Extract @tag_name
      if (value.includes("@tag_name")) {
        const match = value.match(/@tag_name\s*\n([\s\S]*)/);
        if (match && match[1]) {
          result.tag_name = cleanBlockContent(match[1]);
        }
      }

      // Extract @usage
      if (value.includes("@usage")) {
        const match = value.match(/@usage\s*\n([\s\S]*)/);
        if (match && match[1]) {
          result.usage = cleanBlockContent(match[1]);
        }
      }
    }
  }

  console.log({ result });

  return result;
}

function parseJsxCode(jsxCode: any) {
  // Wrap in parens to allow JSX fragment parsing
  const ast = recast.parse(`(${jsxCode})`);
  return ast.program.body[0].expression;
}
```
