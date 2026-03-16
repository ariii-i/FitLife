import * as TE from "fp-ts/TaskEither";
import { describe, expect, it } from "vitest";

import { drop_component_from_zen_cloud } from ".";
import { ACTION_TYPE_INSERT_BEFORE } from "../config";

import { T_Files, Type_Zen_Cloud_Payload } from "./types";

const button_component_code = `
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

const zen_cloud_file_obj = {
  "zen-components/buttons/index.jsx": button_component_code,
};

const file_obj: T_Files = {
  "app.jsx": sourceCode,
};

describe("_drop_component_from_zen_cloud", () => {
  it("should insert correct import declaration for zen component on current file", async () => {
    let payload: Type_Zen_Cloud_Payload = {
      zen_cloud_src: {
        entry_file_name: "zen-components/buttons/index.jsx",
        file_obj: zen_cloud_file_obj,
        component_name: "SampleButton",
        zen_component_id: "comp_12345",
        is_premium: false,
        is_published: true,
        metadata: {
          tag: "Button",
          description: "This is button component",
          usage: "<Button>Lorem ipsum dolor</Button>",
        },
      },
      destination_file_name: "app.jsx",
      destination_line_number: 10,
      action_type: ACTION_TYPE_INSERT_BEFORE,
    };

    const result = await drop_component_from_zen_cloud(payload, file_obj)();
    if (result._tag === "Left") {
      throw result.left;
    }
    const files = result.right;
    expect(files).toHaveProperty("app.jsx");
    expect(files["app.jsx"]).toMatch(
      /import \{ Button \} from ['"]\.\.?\/?zen-components\/buttons\/index\.jsx['"]/
    );
    expect(files["app.jsx"]).toMatch(/<Button>Lorem ipsum dolor<\/Button>/);
    expect(files).toHaveProperty("zen-components/buttons/index.jsx");
  });
});
