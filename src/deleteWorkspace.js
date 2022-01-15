const vscode = require("vscode");

// Prompts the user for confirmation and then deletes a workspace file.
const deleteWorkspace = async (context, treeDataProvider) => {
  const workspaceUri = vscode.Uri.file(context.workspaceFileNameAndFilePath);

  const results = await vscode.window.showWarningMessage(
    `Are you sure you want to delete ${context.label} workspace?`,
    ...["Delete Workspace", "Cancel"]
  );

  if (results === undefined || results === "Cancel") {
    return;
  }

  // Delete workspace file.
  await vscode.workspace.fs.delete(workspaceUri);

  // Refresh Tree
  treeDataProvider.refresh();
};

module.exports = deleteWorkspace;
