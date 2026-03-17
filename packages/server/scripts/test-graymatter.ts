import grayMatter from "gray-matter";

const entryIndex = `/*
---
tag: Index
description: index file
usage: |
  <Index />
---
*/
import { Button } from "./Button";
`;

const blockMatch = entryIndex.match(/^\s*\/\*([\s\S]*?)\*\//);
let candidate = entryIndex;
if (blockMatch) {
  const inner = blockMatch[1];
  const firstDelim = inner.indexOf("---");
  const lastDelim = inner.lastIndexOf("---");
  if (firstDelim !== -1 && lastDelim !== -1 && lastDelim > firstDelim) {
    candidate = inner.slice(firstDelim, lastDelim + 3);
  } else {
    candidate = inner;
  }
}

console.log("candidate:\n", candidate);
console.log("grayMatter result:\n", grayMatter(candidate));
