// ------------------------------------------------------------------ //
// Performs most of the work of the Workspace Explorer. Builds a vscode
// TreeDataProvider to feed data to the Workspace Explorer view.
// ------------------------------------------------------------------ //

import fs from "node:fs";
import path from "node:path";
import util from "node:util";
import vscode from "vscode";
import WorkspaceTreeItem from "./workspaceTreeItem";
import resolveConfigs, { ResolvedExtensionConfig } from "./resolveConfigs";

// Sort folders and workspace files alphabetically,
// putting folders above workspace files.
const sortFilesAndFolders = function sortFilesAndFolders(
  a: WorkspaceTreeItem,
  b: WorkspaceTreeItem,
) {
  if (a.collapsibleState === vscode.TreeItemCollapsibleState.Collapsed) {
    if (b.collapsibleState === vscode.TreeItemCollapsibleState.Collapsed) {
      const labelA =
        typeof a.label === "string" ? a.label : a.label?.label || "";
      const labelB =
        typeof b.label === "string" ? b.label : b.label?.label || "";
      return labelA.localeCompare(labelB, undefined, { sensitivity: "base" });
    }
    return -1;
  }
  if (b.collapsibleState === vscode.TreeItemCollapsibleState.Collapsed) {
    return 1;
  }
  const labelA = typeof a.label === "string" ? a.label : a.label?.label || "";
  const labelB = typeof b.label === "string" ? b.label : b.label?.label || "";
  return labelA.localeCompare(labelB, undefined, { sensitivity: "base" });
};

// Gets an async version of fs.readdir
const readdirAsync = util.promisify(fs.readdir);

// Gets the list of .code-workspace files in the directory specified and
// also returns any sub-directories.
const findChildren = async (
  workspaceStorageDirectory: string,
  workspaceIcon: string | null,
  isForExplorer: boolean,
) => {
  const filenames = await readdirAsync(workspaceStorageDirectory);
  const workspaceFiles: string[] = [];
  filenames.forEach((value) => {
    if (value.endsWith(".code-workspace")) {
      workspaceFiles.push(value);
    } else if (
      fs
        .lstatSync(fs.realpathSync(`${workspaceStorageDirectory}/${value}`))
        .isDirectory()
    ) {
      workspaceFiles.push(value);
    }
  });
  // Create a tree-item for each .code-workspaces file.
  const workspaceArray: WorkspaceTreeItem[] = [];
  workspaceFiles.forEach((value) => {
    let fileOrFolder = "";
    if (workspaceIcon) {
      fileOrFolder = value.endsWith(".code-workspace")
        ? `$(${workspaceIcon}) `
        : "$(settings-group-collapsed) ";
    }
    const label = `${fileOrFolder}${value.replace(".code-workspace", "")}`;
    const workspaceFileNameAndFilePath = fs.realpathSync(
      `${workspaceStorageDirectory}/${value}`,
    );
    const collapsibleState = fs
      .lstatSync(workspaceFileNameAndFilePath)
      .isDirectory()
      ? vscode.TreeItemCollapsibleState.Collapsed
      : vscode.TreeItemCollapsibleState.None;
    const treeItem = new WorkspaceTreeItem(
      label,
      workspaceFileNameAndFilePath,
      collapsibleState,
      undefined,
      false,
      isForExplorer,
    );
    workspaceArray.push(treeItem);
  });
  return workspaceArray.sort(sortFilesAndFolders);
};

// Custom TreeDataProvider that returns workspace and folder data
// to be displayed in the TreeView.
export default class WorkspaceTreeDataProvider implements vscode.TreeDataProvider<WorkspaceTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    WorkspaceTreeItem | undefined
  >;
  readonly onDidChangeTreeData: vscode.Event<
    WorkspaceTreeItem | undefined | null | void
  >;
  private workspaceIcon: string | null;
  private targetIconUri: vscode.Uri | undefined;
  public workspaceStorageDirectory: string;
  public extensionConfig: ResolvedExtensionConfig | undefined;
  private isForExplorer: boolean;

  constructor({
    workspaceIcon,
    isForExplorer,
  }: {
    workspaceIcon?: string;
    isForExplorer?: boolean;
  }) {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    this.extensionConfig;
    this.workspaceStorageDirectory = "";
    this.targetIconUri;
    this.workspaceIcon = workspaceIcon || null;
    this.isForExplorer = isForExplorer ?? false;
    this.getConfigs();
  }

  // Gets user set configuration values.
  getConfigs() {
    return resolveConfigs(this.refresh.bind(this))
      .then((configs) => {
        this.extensionConfig = configs;
        this.workspaceStorageDirectory = configs.workspaceStorageDirectory;
      })
      .catch((err) => vscode.window.showErrorMessage(err));
  }

  // Rebuilds the Tree of workspaces and sub-folders.
  // Repopulates the Workspace Explorer view.
  refresh(targetIconUri?: vscode.Uri) {
    this.getConfigs();
    this.targetIconUri = targetIconUri;
    this._onDidChangeTreeData.fire(undefined);
  }

  // Gets the parent of the current workspace file or folder.
  getParent(element: WorkspaceTreeItem): WorkspaceTreeItem | undefined {
    return element.parent;
  }

  // Gets vscode Tree Items representing a workspace or folder.
  getTreeItem(element: WorkspaceTreeItem) {
    // Check if item is using an icon that must be force reloaded due
    // to a change icon action initiated by the user who overwrote the
    // original icon file.
    let useNewUri = false;
    if (this.targetIconUri) {
      const partialIconPath = this.targetIconUri.fsPath.replace(
        path.extname(this.targetIconUri.fsPath),
        "",
      );
      const partialWorkspacePath = element.workspaceFileNameAndFilePath.replace(
        path.extname(element.workspaceFileNameAndFilePath),
        "",
      );
      if (partialIconPath === partialWorkspacePath) {
        useNewUri = true;
      }
    }

    const treeItem = new WorkspaceTreeItem(
      element.label || "",
      element.workspaceFileNameAndFilePath,
      element.collapsibleState !== undefined
        ? element.collapsibleState
        : vscode.TreeItemCollapsibleState.None,
      this.extensionConfig,
      useNewUri,
      this.isForExplorer,
    );

    if (useNewUri) {
      this.targetIconUri = undefined;
    }

    return treeItem;
  }

  // This runs on activation and any time a collapsed item is expanded.
  async getChildren(element?: WorkspaceTreeItem) {
    if (this.workspaceStorageDirectory === undefined) {
      return [];
    }
    // Find root level workspaces and folders.
    if (element === undefined) {
      return findChildren(
        this.workspaceStorageDirectory,
        this.workspaceIcon,
        this.isForExplorer,
      );
    }
    return findChildren(
      element.workspaceFileNameAndFilePath,
      this.workspaceIcon,
      this.isForExplorer,
    );
  }
}
