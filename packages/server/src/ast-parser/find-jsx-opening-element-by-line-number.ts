import * as recast from "recast";
import * as O from "fp-ts/Option";

export const find_jsx_opening_element_by_line_number = (
  ast: recast.types.ASTNode,
  lineNumber: number
): O.Option<any> => {
  let result: O.Option<any> = O.none;

  recast.visit(ast, {
    visitJSXElement(path) {
      const startLine = path?.node?.loc?.start?.line;

      if (startLine === lineNumber) {
        result = O.some(path);
        return false; // stop traversal
      }

      return this.traverse(path);
    },
  });

  return result;
};
