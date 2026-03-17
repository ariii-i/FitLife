AGENTS

- Purpose: guidance for automated coding agents operating in this repository.
- Repo layout: root contains `package.json` and `src/`; main code lives under `src/ast-parser/`.

- Important files
  - `package.json` — npm/pnpm scripts and dependency list
  - `src/index.ts` — CLI / entrypoint used by `pnpm run dev`
  - `src/ast-parser/*.ts` and subfolders — primary library code
  - `src/ast-parser/drop-existing-tag/index.ts` — example command/module to run directly

Build / Lint / Test Commands

- Install dependencies
  - `pnpm install` (recommended) or `npm install` — install project dependencies.

- Development / Run
  - `pnpm run dev` or `npm run dev` — runs `tsx watch src/index.ts` as defined in `package.json`.
  - Run a single module for quick debugging: `npx tsx src/ast-parser/drop-existing-tag/index.ts` or `npx tsx src/index.ts`.

- Type checking
  - If you add a `tsconfig.json`: `npx tsc --noEmit` — run a full type-check only.

- Tests (recommended setups and single-test commands)
  - This repository currently has no test framework configured. Recommended quick setups and commands to run a single test:
    1. Vitest (recommended for speed & DX)
       - Install: `pnpm add -D vitest @types/node` (or `npm i -D vitest @types/node`).
       - Suggested `package.json` scripts: `"test": "vitest"`, `"test:watch": "vitest --watch"`.
       - Run all tests: `pnpm test` or `npx vitest`.
       - Run a single test file: `npx vitest run path/to/file.test.ts`.
       - Run a single test by name: `npx vitest -t "my test name"`.
    2. Jest (alternative)
       - Install: `pnpm add -D jest ts-jest @types/jest`.
       - Run all tests: `npx jest`.
       - Run a single test file: `npx jest path/to/file.test.ts --runTestsByPath`.

- Lint / Format
  - The repo currently lacks ESLint/Prettier configs. After adding them, use:
    - `npx eslint "src/**/*.{ts,tsx}"` — lint code.
    - `npx prettier --write "src/**/*.{ts,tsx}"` — format code.
  - Suggested `package.json` scripts:
    - `"lint": "eslint 'src/**/*.{ts,tsx}'"`
    - `"format": "prettier --write 'src/**/*.{ts,tsx}'"`

Code Style Guidelines (for agents to follow)

- General principles
  - Make small, focused changes. Preserve established patterns unless performing a deliberate repo-wide refactor discussed with maintainers.
  - Favor clarity, explicitness, and types over clever but opaque constructs.
  - Keep changes easily reversible and well-documented in commit messages when asked to commit.

- Imports
  - Order imports in three groups with a blank line between each:
    1. Node builtins (fs, path, etc.)
    2. External packages (fp-ts, recast, etc.)
    3. Internal modules (relative paths from `src/`)
  - Prefer explicit named imports for most packages. Use namespace imports for `fp-ts` and `recast` when consistent with existing code:
    - `import * as E from "fp-ts/Either"`
    - `import * as recast from "recast"`
  - Keep relative paths short and prefer `./` and `../` over long chains.

- Formatting
  - Use Prettier to standardize formatting. Recommended baseline:
    - 2 spaces indentation.
    - Semicolons enabled.
    - Double quotes for strings (the codebase currently mixes: pick one and run Prettier to normalize).
    - Keep lines readable, prefer wrapping >100 characters.
  - Run `prettier --write` before committing if no hook is present.

- Types and naming conventions
  - Type aliases: prefix with `T_` (e.g. `T_Ast_Payload`, `T_Files`).
  - Exported interfaces: prefix with `I` (e.g. `IConfig`).
  - Functions and variables: use camelCase (e.g. `findSelectedJsxElement`, `parseAst`). The repository contains some snake-ish identifiers; preserve them only when they are pervasive and intentionally chosen.
  - Constants: UPPER_SNAKE_CASE for exported constants (e.g. `ACTION_TYPE_INSERT_BEFORE`).
  - Filenames: prefer lower-kebab or lower-snake (e.g. `swap-tsg.ts`, `drop-existing-tag/index.ts`).

- fp-ts and functional patterns
  - Use `pipe` for composition: `pipe(value, E.chain(...), E.map(...))`.
  - Use `Either` for fallible computations and prefer returning an `Either` rather than throwing in library functions.
  - Convert `Option` to `Either` or handle `Option` explicitly with `O.match`.
  - Use `E.tryCatch` when calling throwy third-party APIs (like recast) and provide helpful error messages in the left branch.

- Error handling
  - Return descriptive `Error` instances inside `E.left(...)` for failures (e.g. `E.left(new Error("AST parse failed: <reason>"))`).
  - Avoid `console.error` inside library functions; leave reporting to CLI entrypoints or caller code.
  - CLI/entrypoint scripts (e.g. `src/index.ts`) may log and exit with non-zero status on unrecoverable errors.

- AST work & recast
  - Avoid mutating the original AST unless the function explicitly documents in-place changes.
  - When reusing nodes between trees, clone nodes. `JSON.parse(JSON.stringify(node))` is acceptable for simple node shapes; for complex nodes prefer recast builders or shallow cloning.
  - Use recast visitors carefully: returning `false` stops traversal, `this.traverse(path)` continues, and `recast.types.builders` helps construct nodes safely.

- Function shape and I/O
  - Library functions should be pure where possible and return `Either` or `Option` for fallible operations.
  - Keep side effects (file writes, network, console) in top-level scripts or clearly named writer utilities.

- Documentation & comments
  - Add concise comments explaining non-obvious logic, especially around AST transformations and fp-ts flows.
  - Exported functions should include a one-line summary plus the input and output types in the comment header.

- Tests
  - Tests should use small, self-contained source strings that exercise transformation behavior.
  - Prefer snapshot assertions against `recast.print(ast).code` to surface formatting/regression changes.
  - When adding tests include a focused description and keep test files close to the module under test (e.g. `src/ast-parser/__tests__/...`).

Git and workspace hygiene for agents

- Worktree awareness
  - You may be in a dirty git worktree. NEVER revert unrelated user changes or overwrite files the user modified.
  - Avoid destructive git commands (`git reset --hard`, `git checkout --`) unless the user explicitly requests them and understands the consequences.

- Committing rules (only commit when asked)
  - Do not create commits unless explicitly requested by the user.
  - When asked to commit: create small, focused commits with a 1-2 sentence message that explains why the change was made.
  - Do not amend commits unless explicitly requested and you can verify HEAD was created by you in this session.
  - If pre-commit hooks fail, surface the failure and suggest fixes rather than automatically bypassing hooks.

- Pull requests (when requested)
  - When asked to open a PR: run `git status`, `git diff`, and `git log` to summarize changes; push to a user-provided branch and create a PR with a short description and list of affected files.
  - Avoid force pushes and never force-push to protected branches.

Automation, tasks and safety

- Running commands
  - Prefer file tools (Read, Glob, Grep) for file operations and the Bash tool only for git/npm/tsc/test commands.
  - Quote paths that contain spaces.

- Tooling rules for agents
  - Use `apply_patch` for small, targeted file edits. Do not use it to generate large amounts of boilerplate (configs, large tests) unless requested.

Cursor / Copilot rules

- Cursor
  - This repository currently does not include `.cursor/rules/` or `.cursorrules`. If any are added, agents must read and strictly obey them and report conflicts or prohibited actions.

- Copilot
  - There is no `.github/copilot-instructions.md` in the repository. If maintainers add one, agents should follow it and surface important constraints.

Suggested next steps for maintainers

- Add a minimal `tsconfig.json` to enable type-checking and predictable builds.
- Add a recommended test runner (Vitest) and a single example test file for `drop-existing-tag` demonstrating the pattern described above.
- Add `.eslintrc.js` and `.prettierrc` with the formatting rules in this document and wire `lint`/`format` scripts into `package.json`.

If you want, I can initialize tests and lint configs and add an example test — tell me which tools you prefer (Vitest/Jest, ESLint/Prettier) and I will create the baseline configs and a sample test.

(End of file)
