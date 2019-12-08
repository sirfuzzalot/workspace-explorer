const path = require('path');

const vscode = require('vscode');

// Prompts the user for a new folder or workspace name and then renames it.
const renameTreeItem = async (context, treeDataProvider) => {
  const oldName = path.basename(context.label);
  const inputResults = await vscode.window.showInputBox(
    {
      prompt: `Enter a new name for ${oldName}.`,
      validateInput: (value) => {
        if (/[/\\:?*"<>|]/.test(value)) {
          return 'Name may not contain /\\:?*"<>|';
        }
        return '';
      },

    },
  );

  // Skip if nothing is entered.
  if (!inputResults) {
    return;
  }

  // Get Current URI
  const currentNameUri = vscode.Uri.file(context.workspaceFileNameAndFilePath);

  // Build New URI
  const newNameUri = vscode.Uri.file(path.join(
    path.dirname(context.workspaceFileNameAndFilePath),
    currentNameUri.path.includes('.code-workspace')
      ? `${inputResults}.code-workspace`
      : inputResults,
  ));

  // Rename
  await vscode.workspace.fs.rename(currentNameUri, newNameUri);

  // Refresh Tree
  treeDataProvider.refresh();
};

module.exports = renameTreeItem;
