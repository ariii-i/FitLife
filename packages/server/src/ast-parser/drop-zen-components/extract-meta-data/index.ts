import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";
import * as A from "fp-ts/ReadonlyArray";
import * as S from "fp-ts/string";
import * as E from "fp-ts/Either";

import type { namedTypes } from "ast-types";

type Metadata = {
  description: string;
  tag_name: string;
  usage: string;
};

const emptyMetadata: Metadata = {
  description: "",
  tag_name: "",
  usage: "",
};

const clearn_block_content = (raw: string): string =>
  pipe(
    raw.split("\n"),
    A.map((line) => line.replace(/^\s*\*\s?/, "")),
    (xs) => xs.join("\n"),
    S.trim
  );

const extract_tag =
  (tag: string) =>
  (value: string): O.Option<string> =>
    pipe(
      value.match(new RegExp(`@${tag}\\s*\\n([\\s\\S]*)`)),
      O.fromNullable,
      O.map((m) => clearn_block_content(m[1]))
    );

export function extract_metadata(ast: namedTypes.File): E.Either<Error, Metadata> {
  const metadata = pipe(
    ast.comments ?? [],
    A.filter((c) => c.type === "CommentBlock"),
    A.map((c) => c.value),
    A.reduce(emptyMetadata, (acc, value) => ({
      description: pipe(
        extract_tag("description")(value),
        O.getOrElse(() => acc.description)
      ),
      tag_name: pipe(
        extract_tag("tag_name")(value),
        O.getOrElse(() => acc.tag_name)
      ),
      usage: pipe(
        extract_tag("usage")(value),
        O.getOrElse(() => acc.usage)
      ),
    }))
  );

  const missing = (Object.entries(metadata) as [keyof Metadata, string][])
    .filter(([, v]) => v.trim().length === 0)
    .map(([k]) => k);

  if (missing.length > 0) {
    return E.left(new Error(`missing metadata fields: ${missing.join(", ")}`));
  }

  return E.right(metadata);
}
