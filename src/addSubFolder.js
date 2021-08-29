const path = require('path');

const vscode = require('vscode');

// Prompts the user for a new folder name and then creates it.
const addSubFolder = async (context, treeDataProvider) => {
  const inputResults = await vscode.window.showInputBox(
    {
      prompt: 'Enter a name for the sub-folder.',
      validateInput: (value) => {
        if (/[/\\:?*"<>|]/.test(value)) {
          return 'Folder name may not contain /\\:?*"<>|';
        }
        return '';
      },

    },
  );

  // Skip if nothing is entered.
  if (!inputResults) {
    return;
  }

  let basePath = context ? context.workspaceFileNameAndFilePath : undefined;
  if (basePath === undefined) {
    basePath = treeDataProvider.workspaceStorageDirectory;
  }

  // Build new Directory path.
  const newFolder = vscode.Uri.file(path.join(
    basePath,
    inputResults,
  ));

  // Create directory
  await vscode.workspace.fs.createDirectory(newFolder);

  // Refresh Tree
  treeDataProvider.refresh();
};

module.exports = addSubFolder;
