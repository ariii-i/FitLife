---
name: update-kanban
description: Manage kanban todo tasks in obsidian-vault. Add, pick, move, complete, remove, or list tasks. Use when user wants to work on a task, add tasks, or manage the kanban.
---

# Kanban Todo Manager

Manage tasks in `obsidian-vault/kanban-todo.md`

## Task Format

Tasks should use task identifiers:
```
- [ ] task-1 write documentation [[detail-file]]
- [ ] task-2 implement feature
```

## Usage

```bash
# List all tasks
update-kanban --operation list

# Add task (auto-generates task-#)
update-kanban --operation add --task-name "new task"

# Pick task by ID (moves to In Progress)
update-kanban --operation pick --task-id task-1

# Pick task by index
update-kanban --operation pick --index 1

# Move task to column
update-kanban --operation move --index 1 --column "Done"

# Complete task (move to Done)
update-kanban --operation complete --index 1

# Remove task
update-kanban --operation remove --index 1
```

## Workflow

1. **Pick a task**: Say "pick task-1" or "work on task-2"
2. **Read linked file**: If task has `[[detail-file]]`, content is shown
3. **Work**: Opencode works on the task
4. **Complete**: Use `--operation complete --index N` when done

## Configuration

- Default vault: `obsidian-vault/kanban-todo.md`
- Override: set `KANBAN_VAULT` environment variable

## Notes

- Cards are moved to In Progress when picked in work mode
- In plan mode, task is shown but card is NOT moved
- Task identifiers like `task-1`, `task-2` are auto-generated on add
