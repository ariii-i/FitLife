import * as recast from "recast";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";

type TFiles = Record<string, string>;

export const get_file_code_option =
  (filename: string) =>
  (files: TFiles): O.Option<string> =>
    O.fromNullable(files[filename]);

export const get_file_code_either =
  (filename: string) =>
  (files: TFiles): E.Either<Error, string> =>
    filename in files ? E.right(files[filename]) : E.left(new Error(`File not found: ${filename}`));
