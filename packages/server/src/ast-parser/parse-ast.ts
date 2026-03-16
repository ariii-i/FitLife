import * as E from "fp-ts/Either";
import * as recast from "recast";
import * as babelParser from "recast/parsers/babel";

import type { namedTypes } from "ast-types";

export const parse_ast = (source: string): E.Either<Error, namedTypes.File> => {
  return E.tryCatch(
    () =>
      recast.parse(source, {
        parser: babelParser, // <-- babelParser.parse exists here
      }),
    (e) => (e instanceof Error ? e : new Error("Parse failed"))
  );
};
