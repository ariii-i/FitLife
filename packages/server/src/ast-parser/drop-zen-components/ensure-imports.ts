import * as recast from "recast";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";

const { namedTypes: n, builders: b } = recast.types;

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
  ast: recast.types.ASTNode,
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
  ast: recast.types.ASTNode, // destinaation ast
  importIdentifier: string, // import name
  importSource: string, // import to be added
  sourceCode: string // zen component source code
): E.Either<Error, recast.types.ASTNode> => {
  if (check_imports_exists(ast, importIdentifier, importSource)) {
    return E.right(ast);
  }

  const analysis = analyze_exports(sourceCode, importIdentifier);

  return pipe(
    create_import_declaration(importIdentifier, importSource, analysis),
    E.map((newImport) => {
      console.log({ newImport, importIdentifier });

      ast.program.body.unshift(newImport);
      return ast;
    })
  );
};
