const fs = require('fs');

const path = require('path');

const vscode = require('vscode');

// Establish Extension's Root Path.
const currentFilePathSegmentList = path.dirname(__filename).split(path.sep);
currentFilePathSegmentList.pop();
const extensionRootPath = path.join(...currentFilePathSegmentList);

// Gets light and dark icon paths from default values.
const getDefaultWorkspaceIcons = function getDefaultWorkspaceIcons(collapsableState) {
  if (collapsableState === vscode.TreeItemCollapsibleState.Collapsed) {
    return {
      light: path.join(
        extensionRootPath,
        'resources',
        'icons',
        'light',
        'folder.svg',
      ),
      dark: path.join(
        extensionRootPath,
        'resources',
        'icons',
        'dark',
        'folder.svg',
      ),
    };
  }
  return {
    light: path.join(
      extensionRootPath,
      'resources',
      'icons',
      'light',
      'workspace.svg',
    ),
    dark: path.join(
      extensionRootPath,
      'resources',
      'icons',
      'dark',
      'workspace.svg',
    ),
  };
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
  } if (fs.existsSync(png)) { // TODO: switch out for promises
    return {
      light: png,
      dark: png,
    };
  }

  // Check the Additional Custom Icon Directory if configured.
  if (extensionConfig.additionalCustomIconDirectory !== '') {
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


// Reimplemented vscode.TreeItem. Provides functionality to each item in
// the TreeView. Calls functions to get custom and default icons.
class WorkspaceTreeItem extends vscode.TreeItem {
  constructor(
    label,
    workspaceFileNameAndFilePath,
    collapsableState,
    extensionConfig,
    useNewUri,
  ) {
    super(label, collapsableState);
    this.workspaceFileNameAndFilePath = workspaceFileNameAndFilePath;

    // Look for custom icons if configuration setting is enabled.
    // Else, get defaults.
    if (extensionConfig.enableCustomIconSearch === true) {
      const icons = getCustomWorkspaceIcons(
        workspaceFileNameAndFilePath,
        collapsableState,
        extensionConfig,
      );
      if (useNewUri) {
        // Create dummy query args to force reload of icon that has
        // been overwritten by the user.
        this.iconPath = {
          light: vscode.Uri.file(icons.light).with(
            { query: `x=${Math.random()}` },
          ),
          dark: vscode.Uri.file(icons.dark).with(
            { query: `x=${Math.random()}` },
          ),
        };
      } else {
        this.iconPath = icons;
      }
    } else {
      this.iconPath = getDefaultWorkspaceIcons(collapsableState);
    }

    this.tooltipLabel;

    // Gives workspace Tree Items click to open in same window behavior.
    if (collapsableState !== vscode.TreeItemCollapsibleState.Collapsed) {
      this.command = {
        command: 'workspaceExplorer.openWorkspaceInSameWindow',
        title: 'Open workspace in same window',
        arguments: [this.workspaceFileNameAndFilePath],
      };
      // Ensures that only files have a plus window icon.
      this.contextValue = 'workspaceFile';
      // Tool tip with workspace name for workspaces.
      this.tooltipLabel = (
        `Click to open ${this.label} workspace in this window.`
      );
    } else {
      // Ensures that only files have a plus window icon.
      this.contextValue = 'folder';
      // Displays the filepath tooltip for folders.
      this.tooltipLabel = this.workspaceFileNameAndFilePath;
    }
  }

  get tooltip() {
    return this.tooltipLabel;
  }
}

module.exports = {
  WorkspaceTreeItem,
};
