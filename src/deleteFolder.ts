import vscode from "vscode";
import WorkspaceTreeDataProvider from "./workspaceTreeDataProvider";
import WorkspaceTreeItem from "./workspaceTreeItem";

// Prompts the user for confirmation and then deletes a folder.
export default async function (
  context: WorkspaceTreeItem,
  treeDataProvider: WorkspaceTreeDataProvider,
) {
  const folderUri = vscode.Uri.file(context.workspaceFileNameAndFilePath);

  const results = await vscode.window.showWarningMessage(
    `Are you sure you want to delete ${context.label} folder and its contents?`,
    ...["Delete Folder", "Cancel"],
  );

  if (results === undefined || results === "Cancel") {
    return;
  }

  // Delete workspace file.
  await vscode.workspace.fs.delete(folderUri, { recursive: true });

  // Refresh Tree
  treeDataProvider.refresh();
}
