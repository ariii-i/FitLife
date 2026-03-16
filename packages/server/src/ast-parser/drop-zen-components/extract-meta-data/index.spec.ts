import { parse } from "recast/parsers/babel";
import { describe, expect, it } from "vitest";
import * as E from "fp-ts/Either";
import { extract_metadata } from ".";

const sampleCode = `
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

describe("extractMetadata", () => {
  it("extracts metadata from comment blocks", () => {
    const ast = parse(sampleCode);

    const result = extract_metadata(ast);

    expect(E.isRight(result)).toBe(true);
    if (E.isRight(result)) {
      expect(result.right).toEqual({
        description: "This is button component",
        tag_name: "Button",
        usage: "<Button>Lorem ipsum dolor</Button>",
      });
    }
  });

  it("returns Left when one or more metadata fields are missing", () => {
    // sample without @usage
    const sampleMissing = `
    /**
     * @description
     * This is button component
     */

    /**
     * @tag_name
     * Button
     */

    import React from "react";
    export const Button = () => {
      return <button>This is a button</button>
    };
    export default Button
    `;

    const ast = parse(sampleMissing);
    const result = extract_metadata(ast);

    expect(E.isLeft(result)).toBe(true);
    if (E.isLeft(result)) {
      expect(result.left.message).toMatch(/usage/);
    }
  });
});
