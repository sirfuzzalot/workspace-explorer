import { Buffer } from "node:buffer";

import path from "node:path";
import vscode from "vscode";
import WorkspaceTreeDataProvider from "./workspaceTreeDataProvider";
import WorkspaceTreeItem from "./workspaceTreeItem";

interface WorkspaceFileFolderInfo {
  path?: string;
  uri?: string;
}
interface WorkspaceFileContents {
  folders: WorkspaceFileFolderInfo[];
  settings: Record<string, unknown>;
  remoteAuthority?: string;
}

// Prompts the user for a workspace name and then creates it.
export default async function (
  context: WorkspaceTreeItem,
  treeDataProvider: WorkspaceTreeDataProvider,
) {
  const inputResults = await vscode.window.showInputBox({
    prompt:
      "Enter a name for the workspace. The contents of your " +
      "current file browser panel will be set as the workspace. If " +
      "the file browser panel is empty you will be prompted to choose " +
      "a folder.",
    validateInput: (value) => {
      if (/[/\\:?*"<>|]/.test(value)) {
        return 'Folder name may not contain /\\:?*"<>|';
      }
      return "";
    },
  });
  // Skip if nothing is entered.
  if (!inputResults) {
    return;
  }

  let basePath = context ? context.workspaceFileNameAndFilePath : undefined;
  if (basePath === undefined) {
    basePath = treeDataProvider.workspaceStorageDirectory;
  }

  // Build new workspace URI.
  const newWorkspaceUri = vscode.Uri.file(
    path.join(basePath, `${inputResults}.code-workspace`),
  );

  // Get Explorer Info
  let folderPaths;
  let remoteAuthority;
  const openWorkspaceFolders = vscode.workspace.workspaceFolders;

  if (openWorkspaceFolders === undefined || openWorkspaceFolders.length === 0) {
    // Get Folders from User as none are open in Explorer.
    let addAnother = true;
    const chosenWorkspaceFolders: string[] = [];
    while (chosenWorkspaceFolders.length === 0 || addAnother) {
      // Opens locally for desktop users. This will not work for desktop remote.
      const newFolder = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: true,
      });

      // Skip if nothing is entered.
      if (!newFolder && chosenWorkspaceFolders.length === 0) {
        return;
      }

      if (!newFolder) {
        break;
      }

      // Add selected folder paths to list.
      newFolder.forEach((item) => chosenWorkspaceFolders.push(item.fsPath));

      if (
        (await vscode.window.showQuickPick(["Add Another Folder", "Done"])) ===
        "Add Another Folder"
      ) {
        addAnother = true;
      } else {
        addAnother = false;
      }
    }

    // Build file path for addition to workspace file.
    folderPaths = chosenWorkspaceFolders.map((folder) => ({ path: folder }));
  } else {
    // Get folders from currently opened folders.
    folderPaths = openWorkspaceFolders.map((folder) => {
      if (folder.uri.scheme === "vscode-remote") {
        remoteAuthority = folder.uri.authority;
        return {
          uri: folder.uri.toString(),
        };
      }
      return {
        path: folder.uri.fsPath,
      };
    });
  }

  const workspaceFileContents: WorkspaceFileContents = {
    folders: folderPaths,
    settings: {},
  };
  if (remoteAuthority) {
    workspaceFileContents.remoteAuthority = remoteAuthority;
  }

  // Create workspace file.
  await vscode.workspace.fs.writeFile(
    newWorkspaceUri,
    Uint8Array.from(
      Buffer.from(JSON.stringify(workspaceFileContents, null, 4)),
    ),
  );

  treeDataProvider.refresh();
}
