// import { describe, it, expect } from "vitest";
// import * as E from "fp-ts/Either";
// import { drop_zen_components, T_Zen_Payload } from "./index";
// import { ACTION_TYPE_INSERT_BEFORE } from "../config";
// import type { T_Files } from "../types";

// const entryIndex = `/*
// ---
// tag: Index
// description: index file
// usage: |
//   <Index />
// ---
// */
// import { Button } from "./Button";
// `;

// const button = `/*
// ---
// tag: Button
// description: A button
// usage: |
//   <Button label=\"Click\" />
// ---
// */
// export const Button = (props) => <button>{props.label}</button>;
// `;

// const destTemplate = `import React from "react";
// export const App = () => <div />;
// `;

// describe("drop_zen_components - basic", () => {
//   it("injects imports and usage from entry and referenced files", () => {
//     const zen_cloud_src: Record<string, string> = {
//       "components/index.jsx": entryIndex,
//       "components/Button.jsx": button,
//     };

//     const files: T_Files = {
//       "app.jsx": destTemplate,
//     };

//     const payload: T_Zen_Payload = {
//       entry_path: "components/index.jsx",
//       zen_cloud_src,
//       destination_file_name: "app.jsx",
//       destination_line_number: 2,
//       action_type: ACTION_TYPE_INSERT_BEFORE as any,
//     };

//     const res = drop_zen_components(payload)(files);
//     // if (E.isLeft(res)) {
//     //   // make the failure informative so we can see the underlying error
//     //   // eslint-disable-next-line no-console
//     //   console.error("drop_zen_components returned Left:", (res as any).left ?? res);
//     //   const left = (res as any).left ?? res;
//     //   throw new Error(`drop_zen_components failed: ${left instanceof Error ? left.message : JSON.stringify(left)}`);
//     // }
//     const updated = E.match(
//       (err: Error) => {
//         throw err;
//       },
//       (v: any) => v
//     )(res);
//     console.log(updated);

//     // expect(updated.files["app.jsx"]).toContain("import { Index } from \"./components/index.jsx\"");
//     // expect(updated.files["app.jsx"]).toContain("import { Button } from \"./components/Button.jsx\"");
//     // expect(updated.files["app.jsx"]).toContain("<Button label=\"Click\" />");
//   });
// });

import { describe, it } from "vitest";

// import * as prettier from "prettier";
// import prettierPluginBabel from "prettier/plugins/babel";
// import prettierPluginEstree from "prettier/plugins/estree";
import { parse } from "recast";
import { drop_component_from_zen_cloud, IZendCloudPayload } from ".";
import { ACTION_TYPE_INSERT_BEFORE } from "../config";

function removeSpacesAndNewLines(input) {
  return input.replace(/\s+/g, "");
}

export const format = (code: any) => {
  return code;
  // return prettier.format(code, {
  //   parser: "babel", // Use the babel parser to handle JSX
  //   plugins: [prettierPluginBabel, prettierPluginEstree],
  //   jsxBracketSameLine: false, // Ensure opening elements are on separate lines
  //   printWidth: 80, // Specify the max width of a line
  //   singleQuote: true, // Use single quotes if preferred
  // });
};

export const parse_ast_from_code = (rawSourceCode: string, config?: any) => {
  return parse(rawSourceCode, config);
};

const code = `export const App = () => {
  const [counter, setCounter] = React.useState(0);
  return <div>
    <div className="p-10 bg-green-100"></div>
    <div className="p-10 bg-blue-100"></div>
  </div>
}
`;

const sample_code = `
/**
 * @description
 * This is button component
*/

/**
 * @tag_name
 * Button
*/

/**
 * @usage
 * <Button>Lorem ipsum dolor</Button>
*/

import React from "react";
export const Button = () => {
  return <button>This is a button</button>
};
export default Button

`;

describe.skip("_drop_component_from_zen_cloud", () => {
  it("should insert correct import declaration for zen component on current file", async () => {
    // before first element
    let payload: IZendCloudPayload = {
      zen_cloud_src: {
        code: JSON.stringify({
          "/components/button.jsx":
            "/**\n * @description\n * This is button component\n*/\n\n/**\n * @tag_name\n * Button\n*/\n\n/**\n * @usage\n * <Button>Lorem ipsum dolor</Button>\n*/\n\nimport React from 'react';\nimport { ButtonLabel } from './button-label.jsx';\n\nexport const Button = () => {\n  return (\n    <button\n      data-selected=\"true\"\n      className=\"bg-lime-700 px-3 py-1 rounded-md hover:bg-lime-600\"\n    >\n      <ButtonLabel />\n    </button>\n  );\n};\n\nexport default Button;\n",
        }),
        component_name: "SampleButton",
        tag_name: "Button",
        entry_file_name: "/components/button.jsx",
      },
      destination_file_name: "px-app.jsx",
      destination_line_number: 4,
      action_type: ACTION_TYPE_INSERT_BEFORE,
    };

    let doneData = {};

    await drop_component_from_zen_cloud(payload, {
      ast_parser_fn: () => {
        return parse_ast_from_code(code);
      },
      format_fn: format,
      done: (params) => {
        doneData = params;
        console.log(params);
      },
    });

    // console.log(doneData);
  });
});
