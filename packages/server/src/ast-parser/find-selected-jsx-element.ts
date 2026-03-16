import * as recast from "recast";
import * as O from "fp-ts/Option";

export const find_selected_jsx_element = (ast: recast.types.ASTNode): O.Option<any> => {
  let result: any = null;

  recast.visit(ast, {
    visitJSXElement(path) {
      const attrs = path.node.openingElement.attributes ?? [];

      const hasSelected = attrs.some(
        (attr: any) => attr.type === "JSXAttribute" && attr.name?.name === "data-selected"
      );

      if (hasSelected) {
        result = path;
        return false;
      }

      this.traverse(path);
      return undefined;
    },
  });

  return O.fromNullable(result);
};
