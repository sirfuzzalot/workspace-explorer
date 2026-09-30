import fs from "node:fs";
import path from "node:path";
import vscode from "vscode";

interface OpenWorkspaceEntry {
  path: string;
  pid: number;
}

export function normalizePath(p: string): string {
  const resolved = path.resolve(p);
  return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}

function isProcessRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

export default class OpenWorkspaceTracker {
  private filePath: string;

  constructor(globalStorageUri: vscode.Uri) {
    const dir = globalStorageUri.fsPath;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.filePath = path.join(dir, "open-workspaces.json");
  }

  register(workspacePath: string): void {
    const entries = this.readEntries().filter((e) => e.pid !== process.pid);
    entries.push({ path: normalizePath(workspacePath), pid: process.pid });
    this.writeEntries(entries);
  }

  unregister(): void {
    const entries = this.readEntries().filter((e) => e.pid !== process.pid);
    this.writeEntries(entries);
  }

  isOpen(workspacePath: string): boolean {
    return this.getOpenWorkspacePaths().has(normalizePath(workspacePath));
  }

  private getOpenWorkspacePaths(): Set<string> {
    const entries = this.readEntries();
    const alive = entries.filter((e) => isProcessRunning(e.pid));
    if (alive.length !== entries.length) {
      this.writeEntries(alive);
    }
    return new Set(alive.map((e) => e.path));
  }

  private readEntries(): OpenWorkspaceEntry[] {
    try {
      return JSON.parse(fs.readFileSync(this.filePath, "utf8"));
    } catch {
      return [];
    }
  }

  private writeEntries(entries: OpenWorkspaceEntry[]): void {
    fs.writeFileSync(this.filePath, JSON.stringify(entries));
  }
}
