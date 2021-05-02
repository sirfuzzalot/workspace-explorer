// ------------------------------------------------------------------ //
// Performs most of the work of the Workspace Explorer. Builds a vscode
// TreeDataProvider to feed data to the Workspace Explorer view.
// ------------------------------------------------------------------ //

const fs = require('fs');

const path = require('path');

const util = require('util');

const vscode = require('vscode');

const { WorkspaceTreeItem } = require('./workspaceTreeItem');

const resolveConfigs = require('./resolveConfigs');

// Sort folders and workspace files alphabetically,
// putting folders above workspace files.
const sortFilesAndFolders = function sortFilesAndFolders(a, b) {
  if (a.collapsableState === vscode.TreeItemCollapsibleState.Collapsed) {
    if (b.collapsableState === vscode.TreeItemCollapsibleState.Collapsed) {
      const sortingArray = [a.label, b.label];
      sortingArray.sort();
      if (a.label === sortingArray[0]) {
        return -1;
      }
      return 1;
    }
    return -1;
  }
  if (b.collapsableState === vscode.TreeItemCollapsibleState.Collapsed) {
    return 1;
  }
  const sortingArray = [a.label, b.label];
  sortingArray.sort();
  if (a.label === sortingArray[0]) {
    return -1;
  }
  return 1;
};

// Gets an async version of fs.readdir
const readdirAsync = util.promisify(fs.readdir);

// Gets the list of .code-workspace files in the directory specified and
// also returns any sub-directories.
const findChildren = async (workspaceStorageDirectory) => {
  const filenames = await readdirAsync(workspaceStorageDirectory);
  const workspaceFiles = [];
  filenames.forEach((value) => {
    if (value.endsWith('.code-workspace')) {
      workspaceFiles.push(value);
    } else if (
      fs.lstatSync(fs.realpathSync(
        `${workspaceStorageDirectory}/${value}`,
      )).isDirectory()) {
      workspaceFiles.push(value);
    }
  });
  // Create a tree-item for each .code-workspaces file.
  const workspaceArray = [];
  workspaceFiles.forEach((value) => {
    workspaceArray.push({
      label: value.replace('.code-workspace', ''),
      workspaceFileNameAndFilePath: (
        fs.realpathSync(
          `${workspaceStorageDirectory}/${value}`,
        )),
      collapsableState: (fs.lstatSync(fs.realpathSync(
        `${workspaceStorageDirectory}/${value}`,
      )).isDirectory())
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None,
    });
  });
  return workspaceArray.sort(sortFilesAndFolders);
};

// Custom TreeDataProvider that returns workspace and folder data
// to be displayed in the TreeView.
class WorkspaceTreeDataProvider {
  constructor() {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    this.extensionConfig;
    this.workspaceStorageDirectory;
    this.targetIconUri;
    this.getConfigs();
  }

  // Gets user set configuration values.
  getConfigs() {
    return resolveConfigs(this.refresh.bind(this))
      .then((configs) => {
        this.extensionConfig = configs;
        this.workspaceStorageDirectory = (
          configs.workspaceStorageDirectory
        );
      })
      .catch((err) => vscode.window.showErrorMessage(err));
  }

  // Rebuilds the Tree of workspaces and sub-folders.
  // Repopulates the Workspace Explorer view.
  refresh(targetIconUri) {
    this.getConfigs();
    this.targetIconUri = targetIconUri;
    this._onDidChangeTreeData.fire();
  }

  // Gets the parent of the current workspace file or folder.
  getParent(element) {
    return element.parent;
  }

  // Gets vscode Tree Items representing a workspace or folder.
  getTreeItem(element) {
    // Check if item is using an icon that must be force reloaded due
    // to a change icon action initiated by the user who overwrote the
    // original icon file.
    let useNewUri = false;
    if (this.targetIconUri) {
      const partialIconPath = this.targetIconUri.fsPath.replace(
        path.extname(this.targetIconUri.fsPath),
        '',
      );
      const partialWorkspacePath = element.workspaceFileNameAndFilePath.replace(
        path.extname(element.workspaceFileNameAndFilePath),
        '',
      );
      if (partialIconPath === partialWorkspacePath) {
        useNewUri = true;
      }
    }
    const treeItem = new WorkspaceTreeItem(
      element.label,
      element.workspaceFileNameAndFilePath,
      element.collapsableState,
      this.extensionConfig,
      useNewUri,
    );

    if (useNewUri) {
      this.targetIconUri = '';
    }

    return treeItem;
  }

  // This runs on activation and any time a collapsed item is expanded.
  async getChildren(element) {
    if (this.workspaceStorageDirectory === undefined) {
      return [];
    }
    if (element === undefined) {
      return findChildren(this.workspaceStorageDirectory);
    }
    return findChildren(element.workspaceFileNameAndFilePath);
  }
}

module.exports = WorkspaceTreeDataProvider;
