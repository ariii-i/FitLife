import * as TE from "fp-ts/TaskEither";
import { describe, it } from "vitest";
import { pipe } from "fp-ts/lib/function";
import * as fs from "fs";

import { ACTION_TYPE_APPEND, ACTION_TYPE_INSERT_AFTER, ACTION_TYPE_INSERT_BEFORE } from "../config";
import type {
  T_Drop_existing_tag_Payload,
  T_New_Tag_Payload,
  Type_Value_Change_Payload,
  Type_Zen_Cloud_Payload,
} from "../types";
import { drop_existing_tag, drop_new_tag, drop_zen_component, update_dom_value } from "./index";

const practical_payload: T_Drop_existing_tag_Payload = {
  tag: "",
  source_file_name: "/src/App.jsx",
  source_line_number: 149, //118,
  source_file_code:
    '\nimport React, { useState } from \'react\';\nimport Counter from \'./Counter.jsx\';\n\nfunction App() {\n  const [theme, setTheme] = useState(\'light\');\n\n  const toggleTheme = () => {\n    setTheme(theme === \'light\' ? \'dark\' : \'light\');\n  };\n\n  return (\n     <>\n  \n  <div className="relative grid min-h-screen grid-cols-[1fr_2.5rem_auto_2.5rem_1fr] grid-rows-[1fr_1px_auto_1px_1fr] bg-white [--pattern-fg:var(--color-gray-950)]/5 dark:bg-gray-950 dark:[--pattern-fg:var(--color-white)]/10">\n    <div className="col-start-3 row-start-3 flex max-w-lg flex-col bg-gray-100 p-2 dark:bg-white/10">\n      <div className="rounded-xl bg-white p-10 text-sm/7 text-gray-700 dark:bg-gray-950 dark:text-gray-300">\n        <img\n          src="https://play.tailwindcss.com/img/logo.svg"\n          className="mb-11.5 h-6 dark:hidden"\n          alt="Tailwind Play"\n        />\n        <img\n          src="https://play.tailwindcss.com/img/logo-dark.svg"\n          className="mb-11.5 h-6 not-dark:hidden"\n          alt="Tailwind Play"\n        />\n        <div className="space-y-6">\n          <p>\n            An advanced online playground for Tailwind CSS, including support\n            for things like:\n          </p>\n          <ul className="space-y-3">\n            <li className="flex">\n              <svg\n                className="h-[1lh] w-5.5 shrink-0"\n                viewBox="0 0 22 22"\n                fill="none"\n                strokeLinecap="square"\n              >\n                <circle cx={11} cy={11} r={11} className="fill-sky-400/25" />\n                <circle\n                  cx={11}\n                  cy={11}\n                  r="10.5"\n                  className="stroke-sky-400/25"\n                />\n                <path\n                  d="M8 11.5L10.5 14L14 8"\n                  className="stroke-sky-800 dark:stroke-sky-300"\n                />\n              </svg>\n              <p className="ml-3">\n                Customizing your theme with\n                <code className="font-mono font-medium text-gray-950 dark:text-white">\n                  @theme\n                </code>\n              </p>\n            </li>\n            <li className="flex">\n              <svg\n                className="h-[1lh] w-5.5 shrink-0"\n                viewBox="0 0 22 22"\n                fill="none"\n                strokeLinecap="square"\n              >\n                <circle cx={11} cy={11} r={11} className="fill-sky-400/25" />\n                <circle\n                  cx={11}\n                  cy={11}\n                  r="10.5"\n                  className="stroke-sky-400/25"\n                />\n                <path\n                  d="M8 11.5L10.5 14L14 8"\n                  className="stroke-sky-800 dark:stroke-sky-300"\n                />\n              </svg>\n              <p className="ml-3">\n                Adding custom utilities with\n                <code className="font-mono font-medium text-gray-950 dark:text-white">\n                  @utility\n                </code>\n              </p>\n            </li>\n            <li className="flex">\n              <svg\n                className="h-[1lh] w-5.5 shrink-0"\n                viewBox="0 0 22 22"\n                fill="none"\n                strokeLinecap="square"\n              >\n                <circle cx={11} cy={11} r={11} className="fill-sky-400/25" />\n                <circle\n                  cx={11}\n                  cy={11}\n                  r="10.5"\n                  className="stroke-sky-400/25"\n                />\n                <path\n                  d="M8 11.5L10.5 14L14 8"\n                  className="stroke-sky-800 dark:stroke-sky-300"\n                />\n              </svg>\n              <p className="ml-3">\n                Adding custom variants with\n                <code className="font-mono font-medium text-gray-950 dark:text-white">\n                  @variant\n                </code>\n              </p>\n            </li>\n            <li className="flex">\n              <svg\n                className="h-[1lh] w-5.5 shrink-0"\n                viewBox="0 0 22 22"\n                fill="none"\n                strokeLinecap="square"\n              >\n                <circle cx={11} cy={11} r={11} className="fill-sky-400/25" />\n                <circle\n                  cx={11}\n                  cy={11}\n                  r="10.5"\n                  className="stroke-sky-400/25"\n                />\n                <path\n                  d="M8 11.5L10.5 14L14 8"\n                  className="stroke-sky-800 dark:stroke-sky-300"\n                />\n              </svg>\n              <p className="ml-3">Code completion with instant preview</p>\n            </li>\n          </ul>\n          <p>\n            Perfect for learning how the framework works, prototyping a new\n            idea, or creating a demo to share online.\n          </p>\n        </div>\n        <hr className="my-6 w-full border-(--pattern-fg)" />\n        <p className="mb-3">Want to dig deeper into Tailwind?</p>\n        <p className="font-semibold">\n          <a\n            href="https://tailwindcss.com/docs"\n            className="text-gray-950 underline decoration-sky-400 underline-offset-3 hover:decoration-2 dark:text-white"\n          >\n            Read the docs →\n          </a>\n        </p>\n      </div>\n    </div>\n    <div className="relative -right-px col-start-2 row-span-full row-start-1 border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed" />\n    <div className="relative -left-px col-start-4 row-span-full row-start-1 border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed" />\n    <div className="relative -bottom-px col-span-full col-start-1 row-start-2 h-px bg-(--pattern-fg)" />\n    <div className="relative -top-px col-span-full col-start-1 row-start-4 h-px bg-(--pattern-fg)" />\n  </div>\n</>\n\n  );\n}\n\nexport default App;\n',
  destination_file_name: "/src/App.jsx",
  destination_line_number: 56,
  destination_file_code:
    '\nimport React, { useState } from \'react\';\nimport Counter from \'./Counter.jsx\';\n\nfunction App() {\n  const [theme, setTheme] = useState(\'light\');\n\n  const toggleTheme = () => {\n    setTheme(theme === \'light\' ? \'dark\' : \'light\');\n  };\n\n  return (\n     <>\n  \n  <div className="relative grid min-h-screen grid-cols-[1fr_2.5rem_auto_2.5rem_1fr] grid-rows-[1fr_1px_auto_1px_1fr] bg-white [--pattern-fg:var(--color-gray-950)]/5 dark:bg-gray-950 dark:[--pattern-fg:var(--color-white)]/10">\n    <div className="col-start-3 row-start-3 flex max-w-lg flex-col bg-gray-100 p-2 dark:bg-white/10">\n      <div className="rounded-xl bg-white p-10 text-sm/7 text-gray-700 dark:bg-gray-950 dark:text-gray-300">\n        <img\n          src="https://play.tailwindcss.com/img/logo.svg"\n          className="mb-11.5 h-6 dark:hidden"\n          alt="Tailwind Play"\n        />\n        <img\n          src="https://play.tailwindcss.com/img/logo-dark.svg"\n          className="mb-11.5 h-6 not-dark:hidden"\n          alt="Tailwind Play"\n        />\n        <div className="space-y-6">\n          <p>\n            An advanced online playground for Tailwind CSS, including support\n            for things like:\n          </p>\n          <ul className="space-y-3">\n            <li className="flex">\n              <svg\n                className="h-[1lh] w-5.5 shrink-0"\n                viewBox="0 0 22 22"\n                fill="none"\n                strokeLinecap="square"\n              >\n                <circle cx={11} cy={11} r={11} className="fill-sky-400/25" />\n                <circle\n                  cx={11}\n                  cy={11}\n                  r="10.5"\n                  className="stroke-sky-400/25"\n                />\n                <path\n                  d="M8 11.5L10.5 14L14 8"\n                  className="stroke-sky-800 dark:stroke-sky-300"\n                />\n              </svg>\n              <p className="ml-3">\n                Customizing your theme with\n                <code className="font-mono font-medium text-gray-950 dark:text-white">\n                  @theme\n                </code>\n              </p>\n            </li>\n            <li className="flex">\n              <svg\n                className="h-[1lh] w-5.5 shrink-0"\n                viewBox="0 0 22 22"\n                fill="none"\n                strokeLinecap="square"\n              >\n                <circle cx={11} cy={11} r={11} className="fill-sky-400/25" />\n                <circle\n                  cx={11}\n                  cy={11}\n                  r="10.5"\n                  className="stroke-sky-400/25"\n                />\n                <path\n                  d="M8 11.5L10.5 14L14 8"\n                  className="stroke-sky-800 dark:stroke-sky-300"\n                />\n              </svg>\n              <p className="ml-3">\n                Adding custom utilities with\n                <code className="font-mono font-medium text-gray-950 dark:text-white">\n                  @utility\n                </code>\n              </p>\n            </li>\n            <li className="flex">\n              <svg\n                className="h-[1lh] w-5.5 shrink-0"\n                viewBox="0 0 22 22"\n                fill="none"\n                strokeLinecap="square"\n              >\n                <circle cx={11} cy={11} r={11} className="fill-sky-400/25" />\n                <circle\n                  cx={11}\n                  cy={11}\n                  r="10.5"\n                  className="stroke-sky-400/25"\n                />\n                <path\n                  d="M8 11.5L10.5 14L14 8"\n                  className="stroke-sky-800 dark:stroke-sky-300"\n                />\n              </svg>\n              <p className="ml-3">\n                Adding custom variants with\n                <code className="font-mono font-medium text-gray-950 dark:text-white">\n                  @variant\n                </code>\n              </p>\n            </li>\n            <li className="flex">\n              <svg\n                className="h-[1lh] w-5.5 shrink-0"\n                viewBox="0 0 22 22"\n                fill="none"\n                strokeLinecap="square"\n              >\n                <circle cx={11} cy={11} r={11} className="fill-sky-400/25" />\n                <circle\n                  cx={11}\n                  cy={11}\n                  r="10.5"\n                  className="stroke-sky-400/25"\n                />\n                <path\n                  d="M8 11.5L10.5 14L14 8"\n                  className="stroke-sky-800 dark:stroke-sky-300"\n                />\n              </svg>\n              <p className="ml-3">Code completion with instant preview</p>\n            </li>\n          </ul>\n          <p>\n            Perfect for learning how the framework works, prototyping a new\n            idea, or creating a demo to share online.\n          </p>\n        </div>\n        <hr className="my-6 w-full border-(--pattern-fg)" />\n        <p className="mb-3">Want to dig deeper into Tailwind?</p>\n        <p className="font-semibold">\n          <a\n            href="https://tailwindcss.com/docs"\n            className="text-gray-950 underline decoration-sky-400 underline-offset-3 hover:decoration-2 dark:text-white"\n          >\n            Read the docs →\n          </a>\n        </p>\n      </div>\n    </div>\n    <div className="relative -right-px col-start-2 row-span-full row-start-1 border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed" />\n    <div className="relative -left-px col-start-4 row-span-full row-start-1 border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed" />\n    <div className="relative -bottom-px col-span-full col-start-1 row-start-2 h-px bg-(--pattern-fg)" />\n    <div className="relative -top-px col-span-full col-start-1 row-start-4 h-px bg-(--pattern-fg)" />\n  </div>\n</>\n\n  );\n}\n\nexport default App;\n',
  action_type: ACTION_TYPE_INSERT_BEFORE,
};

const new_tag_payload: T_New_Tag_Payload = {
  tag: "p",
  destination_file_name: "/src/App.jsx",
  destination_line_number: 56,
  destination_file_code:
    '\nimport React, { useState } from \'react\';\nimport Counter from \'./Counter.jsx\';\n\nfunction App() {\n  const [theme, setTheme] = useState(\'light\');\n\n  const toggleTheme = () => {\n    setTheme(theme === \'light\' ? \'dark\' : \'light\');\n  };\n\n  return (\n     <>\n  \n  <div className="relative grid min-h-screen grid-cols-[1fr_2.5rem_auto_2.5rem_1fr] grid-rows-[1fr_1px_auto_1px_1fr] bg-white [--pattern-fg:var(--color-gray-950)]/5 dark:bg-gray-950 dark:[--pattern-fg:var(--color-white)]/10">\n    <div className="col-start-3 row-start-3 flex max-w-lg flex-col bg-gray-100 p-2 dark:bg-white/10">\n      <div className="rounded-xl bg-white p-10 text-sm/7 text-gray-700 dark:bg-gray-950 dark:text-gray-300">\n        <img\n          src="https://play.tailwindcss.com/img/logo.svg"\n          className="mb-11.5 h-6 dark:hidden"\n          alt="Tailwind Play"\n        />\n        <img\n          src="https://play.tailwindcss.com/img/logo-dark.svg"\n          className="mb-11.5 h-6 not-dark:hidden"\n          alt="Tailwind Play"\n        />\n        <div className="space-y-6">\n          <p>\n            An advanced online playground for Tailwind CSS, including support\n            for things like:\n          </p>\n          <ul className="space-y-3">\n            <li className="flex">\n              <svg\n                className="h-[1lh] w-5.5 shrink-0"\n                viewBox="0 0 22 22"\n                fill="none"\n                strokeLinecap="square"\n              >\n                <circle cx={11} cy={11} r={11} className="fill-sky-400/25" />\n                <circle\n                  cx={11}\n                  cy={11}\n                  r="10.5"\n                  className="stroke-sky-400/25"\n                />\n                <path\n                  d="M8 11.5L10.5 14L14 8"\n                  className="stroke-sky-800 dark:stroke-sky-300"\n                />\n              </svg>\n              <p className="ml-3">\n                Customizing your theme with\n                <code className="font-mono font-medium text-gray-950 dark:text-white">\n                  @theme\n                </code>\n              </p>\n            </li>\n            <li className="flex">\n              <svg\n                className="h-[1lh] w-5.5 shrink-0"\n                viewBox="0 0 22 22"\n                fill="none"\n                strokeLinecap="square"\n              >\n                <circle cx={11} cy={11} r={11} className="fill-sky-400/25" />\n                <circle\n                  cx={11}\n                  cy={11}\n                  r="10.5"\n                  className="stroke-sky-400/25"\n                />\n                <path\n                  d="M8 11.5L10.5 14L14 8"\n                  className="stroke-sky-800 dark:stroke-sky-300"\n                />\n              </svg>\n              <p className="ml-3">\n                Adding custom utilities with\n                <code className="font-mono font-medium text-gray-950 dark:text-white">\n                  @utility\n                </code>\n              </p>\n            </li>\n            <li className="flex">\n              <svg\n                className="h-[1lh] w-5.5 shrink-0"\n                viewBox="0 0 22 22"\n                fill="none"\n                strokeLinecap="square"\n              >\n                <circle cx={11} cy={11} r={11} className="fill-sky-400/25" />\n                <circle\n                  cx={11}\n                  cy={11}\n                  r="10.5"\n                  className="stroke-sky-400/25"\n                />\n                <path\n                  d="M8 11.5L10.5 14L14 8"\n                  className="stroke-sky-800 dark:stroke-sky-300"\n                />\n              </svg>\n              <p className="ml-3">\n                Adding custom variants with\n                <code className="font-mono font-medium text-gray-950 dark:text-white">\n                  @variant\n                </code>\n              </p>\n            </li>\n            <li className="flex">\n              <svg\n                className="h-[1lh] w-5.5 shrink-0"\n                viewBox="0 0 22 22"\n                fill="none"\n                strokeLinecap="square"\n              >\n                <circle cx={11} cy={11} r={11} className="fill-sky-400/25" />\n                <circle\n                  cx={11}\n                  cy={11}\n                  r="10.5"\n                  className="stroke-sky-400/25"\n                />\n                <path\n                  d="M8 11.5L10.5 14L14 8"\n                  className="stroke-sky-800 dark:stroke-sky-300"\n                />\n              </svg>\n              <p className="ml-3">Code completion with instant preview</p>\n            </li>\n          </ul>\n          <p>\n            Perfect for learning how the framework works, prototyping a new\n            idea, or creating a demo to share online.\n          </p>\n        </div>\n        <hr className="my-6 w-full border-(--pattern-fg)" />\n        <p className="mb-3">Want to dig deeper into Tailwind?</p>\n        <p className="font-semibold">\n          <a\n            href="https://tailwindcss.com/docs"\n            className="text-gray-950 underline decoration-sky-400 underline-offset-3 hover:decoration-2 dark:text-white"\n          >\n            Read the docs →\n          </a>\n        </p>\n      </div>\n    </div>\n    <div className="relative -right-px col-start-2 row-span-full row-start-1 border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed" />\n    <div className="relative -left-px col-start-4 row-span-full row-start-1 border-x border-x-(--pattern-fg) bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed" />\n    <div className="relative -bottom-px col-span-full col-start-1 row-start-2 h-px bg-(--pattern-fg)" />\n    <div className="relative -top-px col-span-full col-start-1 row-start-4 h-px bg-(--pattern-fg)" />\n  </div>\n</>\n\n  );\n}\n\nexport default App;\n',
  action_type: ACTION_TYPE_INSERT_BEFORE,
};

describe("drop_existing_tag - happy paths", () => {
  // it("moves a node between different files (cross-file) - snapshot", () => {
  //   const files = filesTemplate();
  //   const payload: T_Ast_Payload & { source_file_code: string; destination_file_code: string } = {
  //     tag: "div",
  //     source_file_name: "component_1.jsx",
  //     source_line_number: 11,
  //     destination_file_name: "component_2.jsx",
  //     destination_line_number: 10,
  //     action_type: ACTION_TYPE_INSERT_BEFORE,
  //     source_file_code: files["component_1.jsx"],
  //     destination_file_code: files["component_2.jsx"],
  //   };

  //   const result = drop_existing_tag(payload)(files);
  //   const updated = unwrapRight(result);
  //   expect(updated).toMatchSnapshot();
  // });

  it("moves a node within the same file (same-file) - snapshot", () => {
    drop_existing_tag(practical_payload);
  });
});

describe("drop_new_tag - happy paths", () => {
  it("drops a new tag that is text - snapshot", () => {
    pipe(
      drop_new_tag({ ...new_tag_payload, tag: "h1" }),
      TE.match(console.error, (files) => {
        Object.entries(files).forEach(([name, code], idx) => {
          fs.writeFileSync(`z--new-tag-output-text.jsx`, code);
        });
      })
    )();
  });

  it("drops a new tag insert before - snapshot", () => {
    pipe(
      drop_new_tag({ ...new_tag_payload, action_type: ACTION_TYPE_INSERT_BEFORE }),
      TE.match(console.error, (files) => {
        Object.entries(files).forEach(([name, code], idx) => {
          fs.writeFileSync(`z--new-tag-insert_before-output.jsx`, code);
        });
      })
    )();
  });

  it("drops a new tag append - snapshot", () => {
    pipe(
      drop_new_tag({ ...new_tag_payload, action_type: ACTION_TYPE_APPEND }),
      TE.match(console.error, (files) => {
        Object.entries(files).forEach(([name, code], idx) => {
          fs.writeFileSync(`z--new-tag-append-output.jsx`, code);
        });
      })
    )();
  });

  it("drops a new tag insert after - snapshot", () => {
    pipe(
      drop_new_tag({ ...new_tag_payload, action_type: ACTION_TYPE_INSERT_AFTER }),
      TE.match(console.error, (files) => {
        Object.entries(files).forEach(([name, code], idx) => {
          fs.writeFileSync(`z--new-tag-insert-after-output.jsx`, code);
        });
      })
    )();
  });
});

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

const zen_cloud_file_obj = {
  "/src/zen-components/buttons/index.jsx": button_component_code,
};

let zen_cloud_component_payload: Type_Zen_Cloud_Payload = {
  zen_cloud_src: {
    entry_file_name: "/src/zen-components/buttons/index.jsx",
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
  destination_file_name: practical_payload.destination_file_name,
  destination_line_number: practical_payload.destination_line_number,
  destination_file_code: practical_payload.destination_file_code,
  action_type: ACTION_TYPE_INSERT_BEFORE,
};

describe("drop_zen_component - happy paths", () => {
  it("drops a zen component - snapshot", () => {
    pipe(
      drop_zen_component(zen_cloud_component_payload),
      TE.match(console.error, (files) => {
        Object.entries(files).forEach(([name, code], idx) => {
          fs.writeFileSync(`z--zen-component-output-${name.replace(/\//g, "-")}`, code);
        });
      })
    )();
  });
});

let value_change_payload: Type_Value_Change_Payload = {
  destination_file_name: practical_payload.destination_file_name,
  destination_line_number: practical_payload.destination_line_number,
  destination_file_code: practical_payload.destination_file_code,
  value: "this is radio nepal",
};

describe("value_changes - happy paths", () => {
  it("update text value for dom - snapshot", () => {
    pipe(
      update_dom_value(value_change_payload),
      TE.match(console.error, (files) => {
        Object.entries(files).forEach(([name, code], idx) => {
          fs.writeFileSync(`z--value-change-output-${name.replace(/\//g, "-")}`, code);
        });
      })
    )();
  });
});
