import { describe, it, expect } from "vitest";
import * as E from "fp-ts/Either";
import { drop_existing_tag } from "./index";
import { ACTION_TYPE_INSERT_BEFORE } from "../config";
import type { T_Files, T_Ast_Payload } from "../types";

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

const filesTemplate = (): T_Files => ({
  "component_1.jsx": sourceCode,
  "component_2.jsx": sourceCode,
});

const unwrapRight = <T>(e: E.Either<Error, T>): T => {
  return E.match(
    (err: Error) => {
      throw err;
    },
    (v: T) => v
  )(e);
};

const extractErrorMessage = <T>(res: E.Either<Error, T>): string =>
  E.match<Error, T, string>(
    (err) => err.message,
    () => ""
  )(res);

describe("drop_existing_tag - happy paths", () => {
  it("moves a node between different files (cross-file) - snapshot", () => {
    const files = filesTemplate();
    const payload: T_Ast_Payload & { source_file_code: string; destination_file_code: string } = {
      tag: "div",
      source_file_name: "component_1.jsx",
      source_line_number: 11,
      destination_file_name: "component_2.jsx",
      destination_line_number: 10,
      action_type: ACTION_TYPE_INSERT_BEFORE,
      source_file_code: files["component_1.jsx"],
      destination_file_code: files["component_2.jsx"],
    };

    const result = drop_existing_tag(payload)(files);
    const updated = unwrapRight(result);
    expect(updated).toMatchSnapshot();
  });

  it("moves a node within the same file (same-file) - snapshot", () => {
    const files = filesTemplate();
    const payload: T_Ast_Payload & { source_file_code: string; destination_file_code: string } = {
      tag: "div",
      source_file_name: "component_1.jsx",
      source_line_number: 11,
      destination_file_name: "component_1.jsx",
      destination_line_number: 10,
      action_type: ACTION_TYPE_INSERT_BEFORE,
      source_file_code: files["component_1.jsx"],
      destination_file_code: files["component_1.jsx"],
    };

    const result = drop_existing_tag(payload)(files);
    const updated = unwrapRight(result);
    expect(updated).toMatchSnapshot();
  });
});

describe("drop_existing_tag - error scenarios", () => {
  it("returns Invalid AST payload when payload is missing required fields", () => {
    const files = filesTemplate();
    const payload = {} as unknown as T_Ast_Payload & {
      source_file_code: string;
      destination_file_code: string;
    };
    const res = drop_existing_tag(payload)(files);
    expect(E.isLeft(res)).toBe(true);
    expect(extractErrorMessage(res)).toBe("Invalid AST payload");
  });

  it("returns file-not-found when destination file is missing", () => {
    const files: T_Files = { "component_1.jsx": sourceCode };
    const payload: T_Ast_Payload & { source_file_code: string; destination_file_code: string } = {
      tag: "div",
      source_file_name: "component_1.jsx",
      source_line_number: 11,
      destination_file_name: "missing_component.jsx",
      destination_line_number: 10,
      action_type: ACTION_TYPE_INSERT_BEFORE,
      source_file_code: files["component_1.jsx"],
      destination_file_code: "", // destination code absent or empty
    };
    const res = drop_existing_tag(payload)(files);
    expect(E.isLeft(res)).toBe(true);
    expect(extractErrorMessage(res)).toContain(
      "Source or destination file not found (source: component_1.jsx"
    );
  });

  it("returns Source JSX element not found when source line is wrong", () => {
    const files = filesTemplate();
    const payload: T_Ast_Payload & { source_file_code: string; destination_file_code: string } = {
      tag: "div",
      source_file_name: "component_1.jsx",
      source_line_number: 999,
      destination_file_name: "component_2.jsx",
      destination_line_number: 10,
      action_type: ACTION_TYPE_INSERT_BEFORE,
      source_file_code: files["component_1.jsx"],
      destination_file_code: files["component_2.jsx"],
    };
    const res = drop_existing_tag(payload)(files);
    expect(E.isLeft(res)).toBe(true);
    expect(extractErrorMessage(res)).toContain(
      "Source JSX element not found (file: component_1.jsx"
    );
  });

  it("returns parse error when source file contains invalid JS", () => {
    const files: T_Files = {
      "component_1.jsx": "<<< invalid js >>>",
      "component_2.jsx": sourceCode,
    };
    const payload: T_Ast_Payload & { source_file_code: string; destination_file_code: string } = {
      tag: "div",
      source_file_name: "component_1.jsx",
      source_line_number: 1,
      destination_file_name: "component_2.jsx",
      destination_line_number: 10,
      action_type: ACTION_TYPE_INSERT_BEFORE,
      source_file_code: files["component_1.jsx"],
      destination_file_code: files["component_2.jsx"],
    };
    const res = drop_existing_tag(payload)(files);
    expect(E.isLeft(res)).toBe(true);
    expect(extractErrorMessage(res)).toContain("Parse failed (source: component_1.jsx");
  });

  it("returns Unsupported action type when action is unknown", () => {
    const files = filesTemplate();
    const payload: T_Ast_Payload & { source_file_code: string; destination_file_code: string } = {
      tag: "div",
      source_file_name: "component_1.jsx",
      source_line_number: 11,
      destination_file_name: "component_2.jsx",
      destination_line_number: 10,
      // @ts-expect-error intentionally invalid action
      action_type: "UNKNOWN_ACTION",
      source_file_code: files["component_1.jsx"],
      destination_file_code: files["component_2.jsx"],
    };
    const res = drop_existing_tag(payload)(files);
    expect(E.isLeft(res)).toBe(true);
    expect(extractErrorMessage(res)).toContain("Unsupported action type");
  });
});
