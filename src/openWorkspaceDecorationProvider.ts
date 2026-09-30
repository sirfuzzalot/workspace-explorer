import vscode from "vscode";
import OpenWorkspaceTracker, { normalizePath } from "./openWorkspaceTracker";

export default class OpenWorkspaceDecorationProvider
  implements vscode.FileDecorationProvider
{
  private _onDidChangeFileDecorations = new vscode.EventEmitter<
    vscode.Uri | vscode.Uri[] | undefined
  >();
  readonly onDidChangeFileDecorations = this._onDidChangeFileDecorations.event;

  constructor(private tracker: OpenWorkspaceTracker) {}

  fire(uris?: vscode.Uri | vscode.Uri[]) {
    this._onDidChangeFileDecorations.fire(uris);
  }

  provideFileDecoration(uri: vscode.Uri): vscode.FileDecoration | undefined {
    if (!uri.fsPath.endsWith(".code-workspace")) {
      return undefined;
    }

    const config = vscode.workspace.getConfiguration("workspaceExplorer");
    if (config.get<boolean>("showOpenIndicator") === false) {
      return undefined;
    }
    if (config.get<boolean>("openIndicatorColorEnabled") === false) {
      return undefined;
    }

    const normalized = normalizePath(uri.fsPath);
    const currentWorkspace = vscode.workspace.workspaceFile?.fsPath;
    const isCurrent =
      currentWorkspace !== undefined &&
      normalizePath(currentWorkspace) === normalized;

    if (isCurrent) {
      const colorId =
        config.get<string>("currentWorkspaceColor") || "charts.green";
      return {
        color: new vscode.ThemeColor(colorId),
        tooltip: "Current workspace",
      };
    }

    if (this.tracker.isOpen(uri.fsPath)) {
      const colorId = config.get<string>("openWorkspaceColor") || "charts.blue";
      return {
        color: new vscode.ThemeColor(colorId),
        tooltip: "Open in another window",
      };
    }

    return undefined;
  }
}
