import { describe, expect, it } from "vitest";

import { props_change, Type_Ast_Payload } from ".";
import { T_Files } from "../types";

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
        <div className="p-10 bg-blue-100">{person.name} {address}</div>
        <img src="old.png" alt="hero" />
    </div>
}
  `;

const file_obj: T_Files = {
  "app.jsx": sourceCode,
};

describe("_drop_component_from_zen_cloud", () => {
  it("should insert correct import declaration for zen component on current file", async () => {
    let payload: Type_Ast_Payload = {
      destination_file_name: "app.jsx",
      destination_line_number: 11,
      props_name: "className",
      props_value: "p-20 bg-red-500",
    };

    const result = await props_change(payload, file_obj)();
    if (result._tag === "Left") {
      throw result.left;
    }
    const files = result.right;
    expect(files).toHaveProperty("app.jsx");
    expect(files["app.jsx"]).toContain("p-20 bg-red-500");
  });

  it("should change src prop for image element", async () => {
    let payload: Type_Ast_Payload = {
      destination_file_name: "app.jsx",
      destination_line_number: 12,
      props_name: "src",
      props_value: "new.png",
    };

    const result = await props_change(payload, file_obj)();
    if (result._tag === "Left") {
      throw result.left;
    }
    const files = result.right;
    expect(files).toHaveProperty("app.jsx");
    expect(files["app.jsx"]).toContain("new.png");
  });
});
