// ------------------------------------------------------------------ //
// Performs most of the work of the Workspace Explorer. Builds a vscode
// TreeDataProvider to feed data to the Workspace Explorer view.
// ------------------------------------------------------------------ //

const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const util = require('util');

// Custom TreeDataProvider that returns workspace and folder data
// to be displayed in the TreeView.

class WorkspaceTreeDataProvider {
  constructor() {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    this.extensionConfig;
    this.workspaceStorageDirectory;
    this.getConfigs();
  }

  // Gets user set configuration values.
  getConfigs() {
    this.extensionConfig = vscode.workspace.getConfiguration(
      'workspaceExplorer',
    );
    if (this.extensionConfig.workspaceStorageDirectory == '') {
      vscode.window.showErrorMessage(
        'Workspace Explorer: You must set the workspace '
              + 'storage directory in your vscode settings. '
              + 'workspaceExplorer.workspaceStorageDirectory',
      );
      this.workspaceStorageDirectory = path.join(
        path.dirname(__filename),
        'resources',
        'icons',
        'light',
      );
    } else {
      this.workspaceStorageDirectory = (
        this.extensionConfig.workspaceStorageDirectory
      );
    }
  }

  // Rebuilds the Tree of workspaces and sub-folders.
  // Repopulates the Workspace Explorer view.
  refresh() {
    this.getConfigs();
    this._onDidChangeTreeData.fire();
  }

  // Gets the parent of the current workspace file or folder.
  getParent(element) {
    return element.parent;
  }

  // Gets vscode Tree Items representing a workspace or folder.
  getTreeItem(element) {
    return new WorkspaceElement(
      element.label,
      element.workspaceFileNameAndFilePath,
      element.collapsableState,
      this.extensionConfig,
    );
  }

  // This runs on activation and any time a collapsed item is expanded.
  getChildren(element) {
    if (element === undefined) {
      return findChildren(this.workspaceStorageDirectory);
    }
    return findChildren(element.workspaceFileNameAndFilePath);
  }
}

// Reimplemented vscode.TreeItem. Provides functionality to each item in
// the TreeView. Calls functions to get custom and default icons.
class WorkspaceElement extends vscode.TreeItem {
  constructor(
    label,
    workspaceFileNameAndFilePath,
    collapsableState,
    extensionConfig,
  ) {
    super(label, collapsableState);
    this.workspaceFileNameAndFilePath = workspaceFileNameAndFilePath;

    // Look for custom icons if configuration setting is enabled.
    // Else, get defaults.
    if (extensionConfig.enableCustomIconSearch === true) {
      this.iconPath = getCustomWorkspaceIcons(
        workspaceFileNameAndFilePath,
        collapsableState,
        extensionConfig,
      );
    } else {
      this.iconPath = getDefaultWorkspaceIcons(collapsableState);
    }

    // Gives workspace Tree Items click to open in same window behavior.
    if (collapsableState != vscode.TreeItemCollapsibleState.Collapsed) {
      this.command = {
        command: 'workspaceExplorer.openWorkspaceInSameWindow',
        title: 'Open workspace in same window',
        arguments: [this.workspaceFileNameAndFilePath],
      };
      // Ensures that only files have a plus icon.
      this.contextValue = 'workspaceFile';
      // Tool tip with workspace name for workspaces.
      this.tooltipLabel = (
        `Click to open ${this.label} workspace in this window.`
      );
    } else {
      // Displays the filepath tooltip for folders.
      this.tooltipLabel = this.workspaceFileNameAndFilePath;
    }

    this.tooltipLabel;
  }

  get tooltip() {
    return this.tooltipLabel;
  }
}

// Gets an async version of fs.readdir
const readdirAsync = util.promisify(fs.readdir);

// Gets the list of .code-workspace files in the directory specified and
// also returns any sub-directories.
const findChildren = function findChildren(workspaceStorageDirectory) {
  return readdirAsync(workspaceStorageDirectory)
    .then((filenames) => {
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
      return workspaceFiles;
    })
  // Create a tree-item for each .code-workspaces file.
    .then((workspaceFiles) => {
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
    });
};

// Searches the same directory as the workspace file or folder
// in search of images of the same name.
const getCustomWorkspaceIcons = function getCustomWorkspaceIcons(
  workspaceFileNameAndFilePath,
  collapsableState,
  extensionConfig,
) {
  let svg;
  let png;

  // Check if the path is a workspace or folder.
  if (workspaceFileNameAndFilePath.includes('.code-workspace')) {
    svg = workspaceFileNameAndFilePath.replace('.code-workspace', '.svg');
    png = workspaceFileNameAndFilePath.replace('.code-workspace', '.png');
  } else {
    svg = `${workspaceFileNameAndFilePath}.svg`;
    png = `${workspaceFileNameAndFilePath}.png`;
  }

  // Check if the .svg or .png exists. Else use the default.
  if (fs.existsSync(svg)) {
    return {
      light: svg,
      dark: svg,
    };
  } if (fs.existsSync(png)) {
    return {
      light: png,
      dark: png,
    };
  }

  // Check the Additional Custom Icon Directory if configured.
  if (extensionConfig.additionalCustomIconDirectory != '') {
    return getCustomWorkspaceIcons(
      path.join(
        extensionConfig.additionalCustomIconDirectory,
        path.basename(workspaceFileNameAndFilePath),
      ),
      collapsableState,
      { additionalCustomIconDirectory: '' },
    );
  }
  return getDefaultWorkspaceIcons(collapsableState);
};

// Gets light and dark icon paths from default values.
const getDefaultWorkspaceIcons = function getDefaultWorkspaceIcons(collapsableState) {
  if (collapsableState == vscode.TreeItemCollapsibleState.Collapsed) {
    return {
      light: path.join(
        path.dirname(__filename),
        'resources',
        'icons',
        'light',
        'folder.svg',
      ),
      dark: path.join(
        path.dirname(__filename),
        'resources',
        'icons',
        'dark',
        'folder.svg',
      ),
    };
  }
  return {
    light: path.join(
      path.dirname(__filename),
      'resources',
      'icons',
      'light',
      'workspace.svg',
    ),
    dark: path.join(
      path.dirname(__filename),
      'resources',
      'icons',
      'dark',
      'workspace.svg',
    ),
  };
};

// Sort folders and workspace files alphabetically,
// putting folders above workspace files.
const sortFilesAndFolders = function sortFilesAndFolders(a, b) {
  if (a.collapsableState == vscode.TreeItemCollapsibleState.Collapsed) {
    if (b.collapsableState == vscode.TreeItemCollapsibleState.Collapsed) {
      const sortingArray = [a.label, b.label];
      sortingArray.sort();
      if (a.label == sortingArray[0]) {
        return -1;
      }
      return 1;
    }
    return -1;
  }
  if (b.collapsableState == vscode.TreeItemCollapsibleState.Collapsed) {
    return 1;
  }
  const sortingArray = [a.label, b.label];
  sortingArray.sort();
  if (a.label == sortingArray[0]) {
    return -1;
  }
  return 1;
};

exports.WorkspaceTreeDataProvider = WorkspaceTreeDataProvider;
