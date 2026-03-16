import * as recast from "recast";

import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";

import { find_selected_jsx_element } from "../find-selected-jsx-element";
import { parse_ast } from "../parse-ast";
import { print_ast } from "../print-ast";

const b = recast.types.builders;

const rename_jsx_tag =
  (tagName: string) =>
  (path: any): void => {
    path.node.openingElement.name = b.jsxIdentifier(tagName);

    if (path.node.closingElement) {
      path.node.closingElement.name = b.jsxIdentifier(tagName);
    }
  };
export const swap_tag = (code: string, tagName: string): E.Either<Error, string> =>
  pipe(
    parse_ast(code),
    E.chain((ast) =>
      pipe(
        find_selected_jsx_element(ast),
        O.map(rename_jsx_tag(tagName)),
        O.match(
          () => E.left(new Error("No selected JSX element found")),
          () => E.right(ast)
        )
      )
    ),
    E.chain(print_ast)
  );
