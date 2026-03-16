import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as recast from "recast";

import { get_file_code_either } from "./get-file-code";
import { swap_tag } from "./swap-tsg";
import type { T_Ast_Payload, TFiles } from "./types";
import { ACTION_TYPE_INSERT_BEFORE } from "./config";
import { drop_existing_tag } from "./drop-existing-tag";

const sourceCode = ` 
import React from "react";
import ReactDOM from 'react-dom/client';
export const Hero = () => {
    const address="asdf"
    const person = {
        name: "JOHN",
    } 
    return <div>
        <div className="p-10 bg-green-100" ></div>
        <div className="p-10 bg-blue-100" data-selected="true">{person.name} {address}</div>
    </div>
}
  `;

const files: TFiles = {
  "component.jsx": sourceCode,
};

const file_name = "component.jsx";
const tag_name = "span";

pipe(
  get_file_code_either(file_name)(files), // Either<Error, string>
  E.chain((code) => swap_tag(code, tag_name)), // Either<Error, string>
  E.match(
    (err) => console.error(err.message),
    (output) => console.log(output)
  )
);
