import fs from "node:fs";
import path from "node:path";
import vscode from "vscode";
import constants from "./constants";
import { ResolvedExtensionConfig } from "./resolveConfigs";

// Establish Extension's Root Path.
const currentFilePathSegmentList = path
  .dirname(__filename)
  .split(path.sep); /* eslint no-undef: "off" */
currentFilePathSegmentList.pop();
const extensionRootPath = path.join(...currentFilePathSegmentList);

// Gets light and dark icon paths from default values.
const getDefaultWorkspaceIcons = function getDefaultWorkspaceIcons(
  collapsibleState: vscode.TreeItemCollapsibleState,
) {
  if (collapsibleState === vscode.TreeItemCollapsibleState.Collapsed) {
    return {
      light: vscode.Uri.file(
        path.join(
          extensionRootPath,
          "resources",
          "icons",
          "light",
          "folder.svg",
        ),
      ),
      dark: vscode.Uri.file(
        path.join(
          extensionRootPath,
          "resources",
          "icons",
          "dark",
          "folder.svg",
        ),
      ),
    };
  }
  return {
    light: vscode.Uri.file(
      path.join(
        extensionRootPath,
        "resources",
        "icons",
        "light",
        "workspace.svg",
      ),
    ),
    dark: vscode.Uri.file(
      path.join(
        extensionRootPath,
        "resources",
        "icons",
        "dark",
        "workspace.svg",
      ),
    ),
  };
};

// Searches the same directory as the workspace file or folder
// in search of images of the same name.
const getCustomWorkspaceIcons = (
  workspaceFileNameAndFilePath: string,
  collapsibleState: vscode.TreeItemCollapsibleState,
  additionalCustomIconDirectory: string,
) => {
  // Check if custom image exists. Else use the default.
  for (let x = 0; x < constants.supportedExtensions.length; x += 1) {
    let imagePath;
    // Check if the path is a workspace or folder.
    if (workspaceFileNameAndFilePath.includes(".code-workspace")) {
      imagePath = workspaceFileNameAndFilePath.replace(
        ".code-workspace",
        constants.supportedExtensions[x],
      );
    } else {
      imagePath = `${workspaceFileNameAndFilePath}${constants.supportedExtensions[x]}`;
    }
    if (fs.existsSync(imagePath)) {
      return {
        light: vscode.Uri.file(imagePath),
        dark: vscode.Uri.file(imagePath),
      };
    }
  }

  // Check the Additional Custom Icon Directory if configured.
  if (additionalCustomIconDirectory !== "") {
    return getCustomWorkspaceIcons(
      path.join(
        additionalCustomIconDirectory,
        path.basename(workspaceFileNameAndFilePath),
      ),
      collapsibleState,
      "",
    );
  }
  return getDefaultWorkspaceIcons(collapsibleState);
};

// Reimplemented vscode.TreeItem. Provides functionality to each item in
// the TreeView. Calls functions to get custom and default icons.
export default class WorkspaceTreeItem extends vscode.TreeItem {
  private tooltipLabel: string | undefined;
  workspaceFileNameAndFilePath: string;
  parent: WorkspaceTreeItem | undefined;

  constructor(
    label: string | vscode.TreeItemLabel,
    workspaceFileNameAndFilePath: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    extensionConfig: ResolvedExtensionConfig | undefined,
    useNewUri: boolean,
    useTooltip: boolean = true,
    isOpen: boolean = false,
    isCurrent: boolean = false,
  ) {
    super(label, collapsibleState);
    this.workspaceFileNameAndFilePath = workspaceFileNameAndFilePath;
    this.parent = undefined;

    const isFolder =
      collapsibleState === vscode.TreeItemCollapsibleState.Collapsed;
    this.contextValue = isFolder ? "folder" : "workspaceFile";
    const randomQuery = { query: `x=${Math.random()}` };

    // Icons: custom when enabled, otherwise defaults
    const icons = extensionConfig?.enableCustomIconSearch
      ? getCustomWorkspaceIcons(
          workspaceFileNameAndFilePath,
          collapsibleState,
          extensionConfig.additionalCustomIconDirectory,
        )
      : getDefaultWorkspaceIcons(collapsibleState);

    // Bust VSCode's icon cache when the user overwrote a custom icon file
    const bustCache = useNewUri && extensionConfig?.enableCustomIconSearch;
    this.iconPath = bustCache
      ? {
          light: icons.light.with(randomQuery),
          dark: icons.dark.with(randomQuery),
        }
      : icons;

    // Click behavior: workspace files get a configurable open command
    this.tooltipLabel = this.workspaceFileNameAndFilePath;
    const clickAction = isFolder
      ? "none"
      : (extensionConfig?.clickAction ?? "newWindow");
    if (clickAction !== "none") {
      const newWindow = clickAction === "newWindow";
      this.command = {
        command: newWindow
          ? "workspaceExplorer.openWorkspaceInNewWindow"
          : "workspaceExplorer.openWorkspaceInSameWindow",
        title: newWindow
          ? "Open workspace in new window"
          : "Open workspace in same window",
        arguments: [this.workspaceFileNameAndFilePath],
      };
      this.tooltipLabel = newWindow
        ? `Click to open ${this.label} workspace in a new window.`
        : `Click to open ${this.label} workspace in this window.`;
    }

    // FileDecorationProvider needs resourceUri to target this item
    if (!isFolder) {
      this.resourceUri = vscode.Uri.file(workspaceFileNameAndFilePath);
    }

    if (isCurrent) {
      if (extensionConfig?.openIndicatorIconEnabled !== false) {
        this.iconPath = new vscode.ThemeIcon(
          extensionConfig?.currentWorkspaceIcon ?? "arrow-circle-right",
          new vscode.ThemeColor(
            extensionConfig?.currentWorkspaceColor ?? "charts.green",
          ),
        );
      }
      this.description = "(Current)";
    } else if (isOpen) {
      if (extensionConfig?.openIndicatorIconEnabled !== false) {
        this.iconPath = new vscode.ThemeIcon(
          extensionConfig?.openWorkspaceIcon ?? "circle-large-outline",
          new vscode.ThemeColor(
            extensionConfig?.openWorkspaceColor ?? "charts.blue",
          ),
        );
      }
      this.description = "(Open)";
    }

    if (useTooltip) {
      this.tooltip = this.tooltipLabel;
    }
  }
}
