import * as E from "fp-ts/Either";
import * as recast from "recast";

export const print_ast = (ast: recast.types.ASTNode): E.Either<Error, string> =>
  E.tryCatch(
    () => recast.print(ast).code,
    (e) => (e instanceof Error ? e : new Error("Print failed"))
  );
