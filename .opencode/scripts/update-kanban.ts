#!/usr/bin/env npx ts-node

import * as fs from 'fs';
import * as path from 'path';

interface KanbanConfig {
  vaultPath: string;
}

interface Task {
  name: string;
  link: string | null;
  index: number;
}

interface Column {
  name: string;
  tasks: Task[];
}

const DEFAULT_VAULT = 'obsidian-vault/kanban-todo.md';

function getVaultPath(config: KanbanConfig): string {
  return config.vaultPath || process.env.KANBAN_VAULT || DEFAULT_VAULT;
}

function parseKanban(content: string): Column[] {
  const columns: Column[] = [];
  const lines = content.split('\n');
  
  let currentColumn: Column | null = null;
  let taskIndex = 0;

  for (const line of lines) {
    const headerMatch = line.match(/^##\s+(.+)/);
    if (headerMatch) {
      if (currentColumn) {
        columns.push(currentColumn);
      }
      currentColumn = { name: headerMatch[1], tasks: [] };
      taskIndex = 0;
      continue;
    }

    const taskMatch = line.match(/^-\s+\[\s*\]\s+(.+)$/);
    if (taskMatch && currentColumn) {
      const taskText = taskMatch[1].trim().replace(/\s+/g, ' ');
      const linkMatch = taskText.match(/\[\[([^\]]+)\]\]/);
      const link = linkMatch ? linkMatch[1] : null;
      const name = taskText.replace(/\[\[([^\]]+)\]\]/, '').trim().replace(/\s+/g, ' ').trim();
      
      currentColumn.tasks.push({
        name,
        link,
        index: ++taskIndex,
      });
    }
  }

  if (currentColumn) {
    columns.push(currentColumn);
  }

  return columns;
}

function findTaskInColumns(columns: Column[], index: number): { column: Column; task: Task } | null {
  for (const column of columns) {
    for (const task of column.tasks) {
      if (task.index === index) {
        return { column, task };
      }
    }
  }
  return null;
}

function findTaskByNameCaseInsensitive(columns: Column[], name: string): { column: Column; task: Task } | null {
  const lowerName = name.toLowerCase();
  for (const column of columns) {
    for (const task of column.tasks) {
      if (task.name.toLowerCase() === lowerName) {
        return { column, task };
      }
    }
  }
  return null;
}

function getLinkContent(link: string, vaultPath: string): string | null {
  const vaultDir = path.dirname(vaultPath);
  const linkPath = path.join(vaultDir, `${link}.md`);
  
  if (fs.existsSync(linkPath)) {
    return fs.readFileSync(linkPath, 'utf-8');
  }
  
  const linkPathWithoutExt = path.join(vaultDir, link);
  if (fs.existsSync(linkPathWithoutExt)) {
    return fs.readFileSync(linkPathWithoutExt, 'utf-8');
  }
  
  return null;
}

function rebuildContent(columns: Column[]): string {
  const parts: string[] = [];
  
  parts.push('---');
  parts.push('');
  parts.push('kanban-plugin: basic');
  parts.push('');
  parts.push('---');
  parts.push('');

  for (const column of columns) {
    parts.push(`## ${column.name}`);
    parts.push('');
    
    for (const task of column.tasks) {
      const linkPart = task.link ? ` [[${task.link}]]` : '';
      parts.push(`- [ ] ${task.name}${linkPart}`);
    }
    
    parts.push('');
  }

  parts.push('');
  parts.push('%% kanban:settings');
  parts.push('```');
  parts.push('{"kanban-plugin":"basic"}');
  parts.push('```');
  parts.push('%%');

  return parts.join('\n');
}

function reindexTasks(columns: Column[]): void {
  let index = 1;
  for (const column of columns) {
    for (const task of column.tasks) {
      task.index = index++;
    }
  }
}

function addTask(columns: Column[], taskName: string, targetColumn: string = 'Backlog'): void {
  const target = columns.find(c => c.name.toLowerCase() === targetColumn.toLowerCase());
  if (!target) {
    console.error(`Column "${targetColumn}" not found`);
    process.exit(1);
  }
  
  const linkMatch = taskName.match(/\[\[([^\]]+)\]\]/);
  const link = linkMatch ? linkMatch[1] : null;
  const name = taskName.replace(/\[\[([^\]]+)\]\]/, '').trim();
  
  target.tasks.push({
    name,
    link,
    index: target.tasks.length + 1,
  });
  
  reindexTasks(columns);
}

function moveTask(columns: Column[], fromIndex: number, toColumn: string): void {
  const found = findTaskInColumns(columns, fromIndex);
  if (!found) {
    console.error(`Task #${fromIndex} not found`);
    process.exit(1);
  }

  const target = columns.find(c => c.name.toLowerCase() === toColumn.toLowerCase());
  if (!target) {
    console.error(`Column "${toColumn}" not found`);
    process.exit(1);
  }

  found.column.tasks = found.column.tasks.filter(t => t.index !== fromIndex);
  found.task.index = target.tasks.length + 1;
  target.tasks.push(found.task);
  
  reindexTasks(columns);
}

function removeTask(columns: Column[], index: number): void {
  const found = findTaskInColumns(columns, index);
  if (!found) {
    console.error(`Task #${index} not found`);
    process.exit(1);
  }

  found.column.tasks = found.column.tasks.filter(t => t.index !== index);
  reindexTasks(columns);
}

function pickTask(vaultPath: string, columns: Column[], index: number): void {
  const found = findTaskInColumns(columns, index);
  if (!found) {
    console.error(`Task #${index} not found`);
    process.exit(1);
  }

  const backlogLower = found.column.name.toLowerCase();
  const isBacklog = backlogLower === 'backlog' || backlogLower.includes('backlog');
  if (!isBacklog) {
    console.error(`Task #${index} is not in Backlog`);
    process.exit(1);
  }

  const target = columns.find(c => {
    const nameLower = c.name.toLowerCase();
    return nameLower === 'in progress' || nameLower.includes('progress');
  });
  if (!target) {
    console.error('In Progress column not found');
    process.exit(1);
  }

  found.column.tasks = found.column.tasks.filter(t => t.index !== index);
  found.task.index = target.tasks.length + 1;
  target.tasks.push(found.task);
  
  reindexTasks(columns);

  console.log(`=== TASK: ${found.task.name} ===`);
  console.log('');
  
  if (found.task.link) {
    const content = getLinkContent(found.task.link, vaultPath);
    if (content) {
      console.log(`=== LINKED FILE: ${found.task.link}.md ===`);
      console.log('');
      console.log(content);
      console.log('');
    }
  }

  console.log(`Task #${index} moved to In Progress.`);
}

function listTasks(columns: Column[]): void {
  for (const column of columns) {
    console.log(`## ${column.name}`);
    for (const task of column.tasks) {
      const linkPart = task.link ? ` [[${task.link}]]` : '';
      console.log(`  ${task.index}. ${task.name}${linkPart}`);
    }
    console.log('');
  }
}

function main(): void {
  const args = process.argv.slice(2);
  
  let vaultPath = DEFAULT_VAULT;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--vault' && args[i + 1]) {
      vaultPath = args[i + 1];
      i++;
    }
  }

  const command = args[0];

  if (!fs.existsSync(vaultPath)) {
    console.error(`Vault file not found: ${vaultPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(vaultPath, 'utf-8');
  const columns = parseKanban(content);

  switch (command) {
    case 'add': {
      const taskName = args.slice(1).join(' ');
      if (!taskName) {
        console.error('Usage: update-kanban add "task name"');
        process.exit(1);
      }
      addTask(columns, taskName);
      break;
    }

    case 'pick': {
      const index = parseInt(args[1], 10);
      if (isNaN(index)) {
        console.error('Usage: update-kanban pick <number>');
        process.exit(1);
      }
      pickTask(vaultPath, columns, index);
      fs.writeFileSync(vaultPath, rebuildContent(columns));
      return;
    }

    case 'move': {
      const moveArgs = args.slice(1).join(' ');
      let index: number;
      let toColumn: string;
      
      if (moveArgs.includes('->')) {
        const parts = moveArgs.split('->');
        index = parseInt(parts[0].trim(), 10);
        toColumn = parts[1].trim().replace(/^["']|["']$/g, '');
      } else {
        const moveMatch = moveArgs.match(/^(\d+)\s*->\s*"([^"]+)"$/) || moveArgs.match(/^(\d+)\s*->\s*(\w+)$/);
        if (!moveMatch) {
          console.error('Usage: update-kanban move <index> -> "column"');
          process.exit(1);
        }
        index = parseInt(moveMatch[1], 10);
        toColumn = moveMatch[2];
      }
      
      if (isNaN(index)) {
        console.error('Usage: update-kanban move <index> -> "column"');
        process.exit(1);
      }
      
      moveTask(columns, index, toColumn);
      break;
    }

    case 'complete': {
      const index = parseInt(args[1], 10);
      if (isNaN(index)) {
        console.error('Usage: update-kanban complete <number>');
        process.exit(1);
      }
      moveTask(columns, index, 'Done');
      break;
    }

    case 'remove': {
      const index = parseInt(args[1], 10);
      if (isNaN(index)) {
        console.error('Usage: update-kanban remove <number>');
        process.exit(1);
      }
      removeTask(columns, index);
      break;
    }

    case 'list': {
      listTasks(columns);
      return;
    }

    default:
      console.log(`
Usage: update-kanban <command> [options]

Commands:
  add "task name"           Add task to Backlog
  pick <number>             Pick task from Backlog (moves to In Progress)
  move <index> -> "column"  Move task to column
  complete <number>         Move task to Done
  remove <number>          Remove task
  list                      List all tasks

Options:
  --vault <path>            Path to vault (default: obsidian-vault/kanban-todo.md)
                            Or set KANBAN_VAULT environment variable
`);
      process.exit(1);
  }

  fs.writeFileSync(vaultPath, rebuildContent(columns));
  console.log('Done.');
}

main();
