import { describe, it, expect } from "vitest";
import * as E from "fp-ts/Either";
import { drop_new_tag, is_text_tag } from "./index";
import type { T_Action_Type, T_Files } from "../types";
import { ACTION_TYPE_INSERT_BEFORE } from "../config";

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

describe("is_text_tag util", () => {
  it("recognises text tags", () => {
    expect(is_text_tag("h1")).toBe(true);
    expect(is_text_tag("div")).toBe(false);
    expect(is_text_tag("P")).toBe(true);
  });
});

describe("drop_new_tag - happy paths", () => {
  it("inserts h1 with lorem text", () => {
    const files = filesTemplate();
    const payload = {
      tag: "h1",
      destination_file_name: "component_2.jsx",
      destination_line_number: 10,
      action_type: ACTION_TYPE_INSERT_BEFORE as T_Action_Type,
    };

    const res = drop_new_tag(payload)(files);
    const updated = unwrapRight(res);
    expect(updated["component_2.jsx"]).toContain("Lorem ipsum dolor sit amet");
  });

  it("inserts div without lorem text", () => {
    const files = filesTemplate();
    const payload = {
      tag: "div",
      destination_file_name: "component_2.jsx",
      destination_line_number: 10,
      action_type: ACTION_TYPE_INSERT_BEFORE as T_Action_Type,
    };

    const res = drop_new_tag(payload)(files);
    const updated = unwrapRight(res);
    expect(updated["component_2.jsx"]).not.toContain("Lorem ipsum dolor sit amet");
  });
});

describe("drop_new_tag - error scenarios", () => {
  it("returns Invalid payload when missing fields", () => {
    const files = filesTemplate();
    const payload = {} as any;
    const res = drop_new_tag(payload)(files);
    expect(E.isLeft(res)).toBe(true);
    expect(extractErrorMessage(res)).toBe("Invalid payload");
  });

  it("returns destination file not found error", () => {
    const files: T_Files = { "component_1.jsx": sourceCode };
    const payload = {
      tag: "h1",
      destination_file_name: "missing.jsx",
      destination_line_number: 1,
      action_type: ACTION_TYPE_INSERT_BEFORE,
    } as any;
    const res = drop_new_tag(payload)(files);
    expect(E.isLeft(res)).toBe(true);
    expect(extractErrorMessage(res)).toContain("Destination file not found: missing.jsx");
  });
});
