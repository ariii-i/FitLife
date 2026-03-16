import * as TE from "fp-ts/TaskEither";
import * as prettier from "prettier";
import prettierPluginBabel from "prettier/plugins/babel";
import prettierPluginEstree from "prettier/plugins/estree";
export const format_code = (code: string): TE.TaskEither<Error, string> => {
  return TE.tryCatch(
    () => {
      return prettier.format(code, {
        parser: "babel", // Use the babel parser to handle JSX
        plugins: [prettierPluginBabel, prettierPluginEstree],
        jsxBracketSameLine: false, // Ensure opening elements are on separate lines
        printWidth: 80, // Specify the max width of a line
        singleQuote: true, // Use single quotes if preferred
      });
    },
    (reason) => new Error(String(reason))
  );
};
