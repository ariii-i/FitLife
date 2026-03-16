import * as E from "fp-ts/Either";
import { drop_zen_components } from "../src/ast-parser/drop-zen-components";
import { ACTION_TYPE_INSERT_BEFORE } from "../src/ast-parser/config";

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

const button = `/*
---
tag: Button
description: A button
usage: |
  <Button label=\"Click\" />
---
*/
export const Button = (props) => <button>{props.label}</button>;
`;

const files = {
  "app.jsx": `import React from "react"; export const App = () => <div />;`,
};

const zen_cloud_src = {
  "components/index.jsx": entryIndex,
  "components/Button.jsx": button,
};

const payload = {
  entry_path: "components/index.jsx",
  zen_cloud_src,
  destination_file_name: "app.jsx",
  destination_line_number: 2,
  action_type: ACTION_TYPE_INSERT_BEFORE,
};

(async () => {
  const res = drop_zen_components(payload as any)(files as any);
  console.log(res);
  console.log("isRight", E.isRight(res));
  if (E.isLeft(res)) console.error(res.left.message);
  if (E.isRight(res)) console.log(res.right);
})();
