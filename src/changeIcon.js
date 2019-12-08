const path = require('path');

const vscode = require('vscode');

// Creates a copy of the selected file and renames it the name of the
// folder or workspace file.
const changeIcon = async (context, treeDataProvider) => {
  try {
    const inputResults = await vscode.window.showOpenDialog(
      {
        // defaultUri: vscode.Uri.file(config.workspaceStorageDirectory),
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: false,
        filters: {
          Images: ['svg', 'png'],
        },
      },
    );

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
    if (path.extname(contextualWorkspaceOrDirectoryName) === '.code-workspace') {
      contextualWorkspaceOrDirectoryName = contextualWorkspaceOrDirectoryName.replace(
        '.code-workspace', '',
      );
    }

    const newIconName = `${contextualWorkspaceOrDirectoryName}${path.extname(selectedImageFile)}`;

    const destinationUri = vscode.Uri.file(
      path.join(contextualWorkspaceDirectoryPath, newIconName),
    );

    const allowedExtensions = ['.svg', '.png'];

    // Check if an image file already exists for the folder or workspace file.
    const workspaceDirectoryContents = await vscode.workspace.fs.readDirectory(
      vscode.Uri.file(contextualWorkspaceDirectoryPath),
    );

    const filteredWorkspaceDirectoryContents = workspaceDirectoryContents.filter(
      (item) => allowedExtensions.includes(path.extname(item[0])),
    );

    const existingIcons = filteredWorkspaceDirectoryContents.filter((item) => {
      return allowedExtensions.find((extension) => {
        return item[0] === `${contextualWorkspaceOrDirectoryName}${extension}`;
      });
    });


    // Offer to remove duplicates.
    let isCancelled = false;
    let conflictingFile;
    try {
      if (existingIcons.length !== 0) {
        const conflictingFiles = existingIcons.map(x => x[0]).join(',');
        const userFeedBack = await vscode.window.showWarningMessage(
          `Conflicting file(s) exists in this directory: ${conflictingFiles}`,
          'Remove File(s)', 'Cancel',
        );

        if (userFeedBack === 'Remove File(s)') {
          const deleteTasks = await existingIcons.map(async (item) => {
            conflictingFile = vscode.Uri.file(
              path.join(contextualWorkspaceDirectoryPath, item[0]),
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

    // Refresh Tree
    treeDataProvider.refresh();

    // VSCode does not reload image resources with same URI.
    if (conflictingFile) {
      const response = await vscode.window.showInformationMessage(
        'VSCode requires a reload for images with the same name',
        ...['Reload Now', 'Do it Later'],
      );
      if (response === 'Reload Now') {
        vscode.commands.executeCommand('workbench.action.reloadWindow');
      }
    }
  } catch (err) {
    vscode.window.showErrorMessage(`ERROR: ${err}`);
  }
};

module.exports = changeIcon;
