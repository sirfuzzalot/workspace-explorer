import path from "node:path";
import vscode from "vscode";

import constants from "./constants";
import WorkspaceTreeDataProvider from "./workspaceTreeDataProvider";
import WorkspaceTreeItem from "./workspaceTreeItem";

// Creates a copy of the selected file and renames it the name of the
// folder or workspace file.
export default async function (
  context: WorkspaceTreeItem,
  treeDataProvider: WorkspaceTreeDataProvider,
) {
  try {
    const inputResults = await vscode.window.showOpenDialog({
      // defaultUri: vscode.Uri.file(config.workspaceStorageDirectory),
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      filters: {
        Images: constants.supportedFormats,
      },
    });

    // Skip if nothing is entered.
    if (!inputResults) {
      return;
    }

    const selectedImageFile = inputResults[0].path;

    const contextualWorkspaceDirectoryPath = path.dirname(
      context.workspaceFileNameAndFilePath,
    );

    // Get Name of workspace or folder. Drop the .code-workspace extension.
    let contextualWorkspaceOrDirectoryName = path.basename(
      context.workspaceFileNameAndFilePath,
    );
    if (
      path.extname(contextualWorkspaceOrDirectoryName) === ".code-workspace"
    ) {
      contextualWorkspaceOrDirectoryName =
        contextualWorkspaceOrDirectoryName.replace(".code-workspace", "");
    }

    const newIconName = `${contextualWorkspaceOrDirectoryName}${path.extname(
      selectedImageFile,
    )}`;

    const destinationUri = vscode.Uri.file(
      path.join(contextualWorkspaceDirectoryPath, newIconName),
    );

    // Check if image files already exists for the folder or workspace file.
    const workspaceDirectoryContents = await vscode.workspace.fs.readDirectory(
      vscode.Uri.file(contextualWorkspaceDirectoryPath),
    );

    const existingIcons = workspaceDirectoryContents
      .filter(
        (item) =>
          item[1] === 1 && // Is file
          constants.supportedExtensions.includes(path.extname(item[0])) &&
          item[0].replace(path.extname(item[0]), "") ===
            contextualWorkspaceOrDirectoryName,
      )
      .map((x) => x[0]);

    // Offer to remove duplicates.
    let isCancelled = false;
    let conflictingFile;
    try {
      if (existingIcons.length !== 0) {
        const conflictingFiles = existingIcons.join(", ");
        const userFeedBack = await vscode.window.showWarningMessage(
          `Conflicting file(s) exists in this directory: ${conflictingFiles}`,
          "Remove File(s)",
          "Cancel",
        );

        if (userFeedBack === "Remove File(s)") {
          const deleteTasks = await existingIcons.map(async (item) => {
            conflictingFile = vscode.Uri.file(
              path.join(contextualWorkspaceDirectoryPath, item),
            );
            await vscode.workspace.fs.delete(conflictingFile);
          });
          await Promise.all(deleteTasks);
        } else {
          isCancelled = true;
        }
      }
    } catch (err) {
      vscode.window.showErrorMessage(
        `ERROR: There was an Error Deleting the Duplicate - ${err}`,
      );
    }

    if (isCancelled) {
      return;
    }

    // Copy the file to the Workspace Storage Directory.
    await vscode.workspace.fs.copy(inputResults[0], destinationUri);

    // Refresh Tree and send URI to force VSCode to relaod
    // with dummy query args.
    treeDataProvider.refresh(conflictingFile);
  } catch (err) {
    vscode.window.showErrorMessage(`ERROR: ${err}`);
  }
}
