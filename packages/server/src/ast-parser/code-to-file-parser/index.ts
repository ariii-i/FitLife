import fs from "node:fs";
import * as TE from "fp-ts/TaskEither";

export const code_to_file_parser = (files: Record<string, string>): TE.TaskEither<Error, void> => {
  return TE.tryCatch(
    async () => {
      //   if (fs.statSync("z-code-to-file-parser").isDirectory()) {
      //     fs.rmdirSync("z-code-to-file-parser");
      //   }
      fs.mkdirSync("z-code-to-file-parser", { recursive: true });

      const write_promises = Object.entries(files).map(([name, code]) => {
        return fs.promises.writeFile(`z-code-to-file-parser/${name.replace(/\//g, "-")}`, code);
      });

      await Promise.all(write_promises);
    },
    (reason) => new Error(String(reason))
  );
};
