import { describe, expect, it } from "vitest";
import { meta_extractor } from ".";

describe("_meta_extractor", () => {
  it("should extract project_id, embedded and compilation_scope from provided url", async () => {
    const result = await meta_extractor(
      "http://localhost:5173//iframe-index.html?embedded=%22true&compilation_scope=app&project_id=1795fd92-45d9-4614-97c7-8b14a4db73dc%22"
    );
    console.log(result);
  });
});
