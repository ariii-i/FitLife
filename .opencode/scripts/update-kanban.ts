import { tool } from "@opencode-ai/plugin";
import * as fs from "fs";
import * as path from "path";

import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";

// ─── Domain types ─────────────────────────────────────────────────────────────

/** Branded string so task IDs can't be confused with plain strings. */
type TaskId = string & { readonly _brand: "TaskId" };

interface Task {
  readonly name: string;
  readonly taskId: O.Option<TaskId>;
  readonly link: O.Option<string>;
  readonly index: number;
}

interface Column {
  readonly name: string;
  readonly tasks: Task[];
}

interface PickResult {
  readonly name: string;
  readonly link: O.Option<string>;
  readonly content: O.Option<string>;
}

type KanbanError = string; // flat string satisfies Promise<string> contract

// ─── Config ───────────────────────────────────────────────────────────────────

const DEFAULT_VAULT = "obsidian-vault/kanban-todo.md";
const BACKLOG_PATTERN = /backlog/i;
const IN_PROGRESS_PATTERN = /in.?progress/i;

const getVaultPath = (): string => process.env.KANBAN_VAULT ?? DEFAULT_VAULT;

// ─── Smart constructors ───────────────────────────────────────────────────────

const toTaskId = (s: string): TaskId => s as TaskId;
const makeTaskId = (n: number): TaskId => toTaskId(`task-${n}`);

// ─── Parsing ─────────────────────────────────────────────────────────────────

const HEADER_RE = /^##\s+(.+)/;
const TASK_RE = /^-\s+\[\s*\]\s+(.+)$/;
const TASKID_RE = /^(task-\d+)\s+(.+)$/;
const LINK_RE = /\[\[([^\]]+)\]\]/;

interface ParseState {
  readonly columns: Column[];
  readonly current: O.Option<{ name: string; tasks: Task[] }>;
  readonly taskIndex: number;
}

// FIX (Bug 2): use O.map instead of directly accessing .value to stay safe
function parseLine(state: ParseState, line: string): ParseState {
  const headerMatch = line.match(HEADER_RE);
  if (headerMatch) {
    const flushed = pipe(
      state.current,
      O.fold(
        () => state.columns,
        (col) => [...state.columns, { name: col.name, tasks: col.tasks }],
      ),
    );
    return {
      columns: flushed,
      current: O.some({ name: headerMatch[1].trim(), tasks: [] }),
      taskIndex: 0,
    };
  }

  const taskMatch = line.match(TASK_RE);
  if (!taskMatch || O.isNone(state.current)) return state;

  const raw = taskMatch[1].trim().replace(/\s+/g, " ");
  const idMatch = raw.match(TASKID_RE);
  const taskId: O.Option<TaskId> = idMatch
    ? O.some(toTaskId(idMatch[1]))
    : O.none;
  const body = idMatch ? idMatch[2] : raw;

  const linkMatch = body.match(LINK_RE);
  const link: O.Option<string> = linkMatch ? O.some(linkMatch[1]) : O.none;
  const name = body.replace(LINK_RE, "").trim().replace(/\s+/g, " ");

  const nextIndex = state.taskIndex + 1;
  const task: Task = { name, taskId, link, index: nextIndex };

  // Safe: O.map only runs when current is Some, so .value access inside is safe
  // but we use O.map to make that guarantee explicit rather than relying on the
  // O.isNone guard above to keep the compiler happy.
  return {
    ...state,
    taskIndex: nextIndex,
    current: pipe(
      state.current,
      O.map((col) => ({ name: col.name, tasks: [...col.tasks, task] })),
    ),
  };
}

function parseKanban(content: string): Column[] {
  const finalState = content.split("\n").reduce<ParseState>(parseLine, {
    columns: [],
    current: O.none,
    taskIndex: 0,
  });

  return pipe(
    finalState.current,
    O.fold(
      () => finalState.columns,
      (col) => [...finalState.columns, { name: col.name, tasks: col.tasks }],
    ),
  );
}

// ─── Lookup ───────────────────────────────────────────────────────────────────

type TaskRef = { readonly column: Column; readonly task: Task };

function buildIndexMap(columns: Column[]): Map<number, TaskRef> {
  return columns.reduce<Map<number, TaskRef>>((map, column) => {
    column.tasks.forEach((task) => map.set(task.index, { column, task }));
    return map;
  }, new Map());
}

const findByIndex = (columns: Column[], index: number): O.Option<TaskRef> =>
  O.fromNullable(buildIndexMap(columns).get(index));

const findByTaskId = (columns: Column[], id: TaskId): O.Option<TaskRef> => {
  const lower = id.toLowerCase();
  return pipe(
    columns,
    A.findFirstMap((column) =>
      pipe(
        column.tasks,
        A.findFirst((task) =>
          pipe(
            task.taskId,
            O.exists((tid) => tid.toLowerCase() === lower),
          ),
        ),
        O.map((task) => ({ column, task })),
      ),
    ),
  );
};

const findColumnBy = (
  columns: Column[],
  pattern: RegExp | string,
): O.Option<Column> =>
  pipe(
    columns,
    A.findFirst((c) =>
      typeof pattern === "string"
        ? c.name.toLowerCase() === pattern.toLowerCase()
        : pattern.test(c.name),
    ),
  );

// ─── Pure mutations (immutable — return new Column[]) ─────────────────────────

function reindexed(columns: Column[]): Column[] {
  let i = 1;
  return columns.map((col) => ({
    ...col,
    tasks: col.tasks.map((task) => ({ ...task, index: i++ })),
  }));
}

const withTaskRemoved = (column: Column, index: number): Column => ({
  ...column,
  tasks: column.tasks.filter((t) => t.index !== index),
});

const withTaskAppended = (column: Column, task: Task): Column => ({
  ...column,
  tasks: [...column.tasks, task],
});

// FIX (Bug 3): guard same-column move — treat it as a no-op to avoid
// the task being simultaneously removed and appended, which would duplicate it.
function transferTask(
  columns: Column[],
  taskIndex: number,
  toColumn: Column,
): E.Either<KanbanError, Column[]> {
  return pipe(
    findByIndex(columns, taskIndex),
    E.fromOption(() => `Task #${taskIndex} not found`),
    E.chain(({ column: fromCol, task }) => {
      if (fromCol.name === toColumn.name) {
        return E.left(`Task #${taskIndex} is already in "${toColumn.name}"`);
      }
      return E.right(
        reindexed(
          columns.map((col) => {
            if (col.name === fromCol.name)
              return withTaskRemoved(col, taskIndex);
            if (col.name === toColumn.name) return withTaskAppended(col, task);
            return col;
          }),
        ),
      );
    }),
  );
}

// ─── Serialisation ────────────────────────────────────────────────────────────

function rebuildContent(columns: Column[]): string {
  const taskLine = (task: Task): string => {
    const id = pipe(
      task.taskId,
      O.fold(
        () => "",
        (tid) => `${tid} `,
      ),
    );
    const link = pipe(
      task.link,
      O.fold(
        () => "",
        (l) => ` [[${l}]]`,
      ),
    );
    return `- [ ] ${id}${task.name}${link}`;
  };

  const colBlock = (col: Column): string[] => [
    `## ${col.name}`,
    "",
    ...col.tasks.map(taskLine),
    "",
  ];

  return [
    "---",
    "",
    "kanban-plugin: basic",
    "",
    "---",
    "",
    ...columns.flatMap(colBlock),
    "",
    "%% kanban:settings",
    "```",
    '{"kanban-plugin":"basic"}',
    "```",
    "%%",
  ].join("\n");
}

// ─── File I/O wrapped in Either ───────────────────────────────────────────────

const fileExists = (filePath: string): E.Either<KanbanError, string> =>
  fs.existsSync(filePath)
    ? E.right(filePath)
    : E.left(`Vault file not found: ${filePath}`);

const readFile = (filePath: string): E.Either<KanbanError, string> =>
  E.tryCatch(
    () => fs.readFileSync(filePath, "utf-8"),
    (e) => `Failed to read file: ${e instanceof Error ? e.message : String(e)}`,
  );

const atomicWrite = (
  filePath: string,
  content: string,
): E.Either<KanbanError, void> => {
  const dir = path.dirname(filePath);
  const tmp = path.join(dir, `.kanban-tmp-${process.pid}-${Date.now()}.md`);
  return E.tryCatch(
    () => {
      fs.writeFileSync(tmp, content, "utf-8");
      fs.renameSync(tmp, filePath);
    },
    (e) => {
      try {
        fs.unlinkSync(tmp);
      } catch {
        /* ignore */
      }
      return `Failed to write file: ${e instanceof Error ? e.message : String(e)}`;
    },
  );
};

// FIX (Bug 1): wrap readFileSync inside E.tryCatch so permission errors
// or TOCTOU races (file deleted between existsSync and readFileSync) are
// caught and returned as Left rather than escaping the Either pipeline.
const getLinkContent = (
  link: string,
  vaultPath: string,
): E.Either<KanbanError, O.Option<string>> => {
  const candidate = path.join(path.dirname(vaultPath), `${link}.md`);
  if (!fs.existsSync(candidate)) return E.right(O.none);
  return pipe(
    E.tryCatch(
      () => fs.readFileSync(candidate, "utf-8"),
      (e) =>
        `Failed to read linked file "${link}.md": ${e instanceof Error ? e.message : String(e)}`,
    ),
    E.map(O.some),
  );
};

// ─── Input helpers ────────────────────────────────────────────────────────────

const sanitizeName = (name: string): string =>
  name
    .replace(/[\r\n]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const nextTaskId = (columns: Column[]): TaskId => {
  const max = columns.reduce(
    (acc, col) =>
      col.tasks.reduce(
        (a, task) =>
          pipe(
            task.taskId,
            O.chain((tid) => O.fromNullable(tid.match(/^task-(\d+)$/))),
            O.fold(
              () => a,
              (m) => Math.max(a, parseInt(m[1], 10)),
            ),
          ),
        acc,
      ),
    0,
  );
  return makeTaskId(max + 1);
};

// ─── Core operations ──────────────────────────────────────────────────────────

function opAdd(
  columns: Column[],
  taskName: string,
  targetColumnName: string,
): E.Either<KanbanError, { columns: Column[]; taskId: TaskId }> {
  const name = sanitizeName(taskName);
  if (!name) return E.left("taskName must not be empty");

  return pipe(
    findColumnBy(columns, targetColumnName),
    E.fromOption(() => `Column "${targetColumnName}" not found`),
    E.map((target) => {
      const linkMatch = name.match(LINK_RE);
      const link: O.Option<string> = linkMatch ? O.some(linkMatch[1]) : O.none;
      const cleanName = name.replace(LINK_RE, "").trim().replace(/\s+/g, " ");
      const taskId = nextTaskId(columns);
      const newTask: Task = {
        name: cleanName,
        taskId: O.some(taskId),
        link,
        index: 0,
      };
      const updated = columns.map((col) =>
        col.name === target.name ? withTaskAppended(col, newTask) : col,
      );
      return { columns: reindexed(updated), taskId };
    }),
  );
}

function opPick(
  vaultPath: string,
  columns: Column[],
  index: number,
  taskId: O.Option<TaskId>,
  moveCard: boolean,
): E.Either<KanbanError, { columns: Column[]; result: PickResult }> {
  // Scope search to Backlog columns only — never search globally and validate
  // after. A global search + post-hoc column check is fragile: index collisions
  // across columns (e.g. Backlog #3 and Done #3 both exist after partial moves)
  // can surface the wrong task, and a Done column whose name somehow matched
  // BACKLOG_PATTERN would bypass the guard entirely.
  const backlogColumns = columns.filter((c) => BACKLOG_PATTERN.test(c.name));

  const found: O.Option<TaskRef> = pipe(
    taskId,
    O.fold(
      () => findByIndex(backlogColumns, index),
      (tid) => findByTaskId(backlogColumns, tid),
    ),
  );

  return pipe(
    found,
    E.fromOption(() =>
      pipe(
        taskId,
        O.fold(
          () => `Task #${index} not found in Backlog`,
          (tid) => `Task "${tid}" not found in Backlog`,
        ),
      ),
    ),
    // FIX (Bug 1): getLinkContent now returns Either, so we chain it
    E.chain(({ task }) =>
      pipe(
        task.link,
        O.fold(
          () => E.right(O.none as O.Option<string>),
          (l) => getLinkContent(l, vaultPath),
        ),
        E.chain((content) => {
          const result: PickResult = {
            name: task.name,
            link: task.link,
            content,
          };

          if (!moveCard) return E.right({ columns, result });

          return pipe(
            findColumnBy(columns, IN_PROGRESS_PATTERN),
            E.fromOption(() => '"In Progress" column not found'),
            E.chain((inProgress) =>
              transferTask(columns, task.index, inProgress),
            ),
            E.map((nextColumns) => ({ columns: nextColumns, result })),
          );
        }),
      ),
    ),
  );
}

function opMove(
  columns: Column[],
  taskIndex: number,
  toColumnName: string,
): E.Either<KanbanError, Column[]> {
  return pipe(
    findColumnBy(columns, toColumnName),
    E.fromOption(() => `Column "${toColumnName}" not found`),
    E.chain((target) => transferTask(columns, taskIndex, target)),
  );
}

function opRemove(
  columns: Column[],
  taskIndex: number,
): E.Either<KanbanError, Column[]> {
  return pipe(
    findByIndex(columns, taskIndex),
    E.fromOption(() => `Task #${taskIndex} not found`),
    E.map(({ column }) =>
      reindexed(
        columns.map((col) =>
          col.name === column.name ? withTaskRemoved(col, taskIndex) : col,
        ),
      ),
    ),
  );
}

function opList(columns: Column[]): string {
  return pipe(
    columns,
    A.map((col) => {
      const taskLines = pipe(
        col.tasks,
        A.map((t) => {
          const id = pipe(
            t.taskId,
            O.fold(
              () => "",
              (tid) => `${tid} `,
            ),
          );
          const link = pipe(
            t.link,
            O.fold(
              () => "",
              (l) => ` [[${l}]]`,
            ),
          );
          return `  ${t.index}. ${id}${t.name}${link}`;
        }),
      );
      return `## ${col.name}\n${taskLines.length > 0 ? taskLines.join("\n") : "  (empty)"}`;
    }),
    (sections) => sections.join("\n\n"),
  );
}

// ─── Persist helper ───────────────────────────────────────────────────────────

const persist =
  (vaultPath: string) =>
  (columns: Column[]): E.Either<KanbanError, Column[]> =>
    pipe(
      atomicWrite(vaultPath, rebuildContent(columns)),
      E.map(() => columns),
    );

// ─── Execute dispatcher ───────────────────────────────────────────────────────

type Args = {
  operation: "add" | "pick" | "move" | "complete" | "remove" | "list";
  taskName?: string;
  taskId?: string;
  index?: number;
  column?: string;
  moveCard?: boolean;
};

// FIX (Gap 2): use args.index == null instead of !args.index so that
// index: 0 is correctly caught as "not provided" rather than falsy.
// (Valid task indices start at 1 after reindexing, so 0 is also meaningfully
// invalid — but the guard is now semantically "was the arg omitted?" not "is it falsy?")
const requireIndex = (args: Args): E.Either<KanbanError, number> =>
  args.index == null
    ? E.left("index is required")
    : args.index < 1
      ? E.left(`index must be ≥ 1, got ${args.index}`)
      : E.right(args.index);

function dispatch(
  args: Args,
  vaultPath: string,
  columns: Column[],
): E.Either<KanbanError, string> {
  const moveCard = args.moveCard !== false;
  const save = persist(vaultPath);

  switch (args.operation) {
    case "add": {
      if (!args.taskName) return E.left("taskName is required for add");
      return pipe(
        opAdd(columns, args.taskName, args.column ?? "Backlog"),
        E.chain(({ columns: next, taskId }) =>
          pipe(
            save(next),
            E.map(() => `Task ${taskId} added to ${args.column ?? "Backlog"}`),
          ),
        ),
      );
    }

    case "pick": {
      if (args.index == null && !args.taskId) {
        return E.left("index or taskId is required for pick");
      }
      const tid: O.Option<TaskId> = args.taskId
        ? O.some(toTaskId(args.taskId))
        : O.none;
      return pipe(
        opPick(vaultPath, columns, args.index ?? 0, tid, moveCard),
        E.chain(({ columns: next, result }) =>
          pipe(
            moveCard ? save(next) : E.right(next),
            E.map(() => {
              const lines: string[] = [`=== TASK: ${result.name} ===`];
              pipe(
                result.link,
                O.map((l) => lines.push(`\nLinked: [[${l}]]`)),
              );
              pipe(
                result.content,
                O.map((c) =>
                  pipe(
                    result.link,
                    O.map((l) =>
                      lines.push(`\n=== LINKED FILE: ${l}.md ===\n${c}`),
                    ),
                  ),
                ),
              );
              if (!moveCard) lines.push("\n(Card not moved — plan mode)");
              return lines.join("\n");
            }),
          ),
        ),
      );
    }

    case "move": {
      if (!args.column) return E.left("column is required for move");
      return pipe(
        requireIndex(args),
        E.chain((idx) => opMove(columns, idx, args.column!)),
        E.chain(save),
        E.map(() => `Task #${args.index} moved to ${args.column}`),
      );
    }

    case "complete": {
      return pipe(
        requireIndex(args),
        E.chain((idx) => opMove(columns, idx, "Done")),
        E.chain(save),
        E.map(() => `Task #${args.index} moved to Done`),
      );
    }

    case "remove": {
      return pipe(
        requireIndex(args),
        E.chain((idx) => opRemove(columns, idx)),
        E.chain(save),
        E.map(() => `Task #${args.index} removed`),
      );
    }

    case "list":
      return E.right(opList(columns));
  }
}

// ─── Tool definition ──────────────────────────────────────────────────────────

export default tool({
  description:
    "Manage kanban todo tasks in an Obsidian vault. Add, pick, move, complete, remove, or list tasks.",
  args: {
    operation: tool.schema
      .enum(["add", "pick", "move", "complete", "remove", "list"])
      .describe("Operation to perform"),
    taskName: tool.schema
      .string()
      .optional()
      .describe("Task name — required for 'add'"),
    taskId: tool.schema
      .string()
      .optional()
      .describe(
        "Task ID like 'task-1' — used by 'pick' as an alternative to index",
      ),
    index: tool.schema
      .number()
      .optional()
      .describe("Task index (≥ 1) — required for move / complete / remove"),
    column: tool.schema
      .string()
      .optional()
      .describe(
        "Target column — required for 'move'; optional for 'add' (defaults to Backlog)",
      ),
    moveCard: tool.schema
      .boolean()
      .optional()
      .describe("Move card to In Progress on 'pick' (default: true)"),
  },

  async execute(args): Promise<string> {
    return pipe(
      fileExists(getVaultPath()),
      E.chain(readFile),
      E.map(parseKanban),
      E.chain((columns) => dispatch(args, getVaultPath(), columns)),
      E.fold(
        (err) => `Error: ${err}`,
        (msg) => msg,
      ),
    );
  },
});
