const path = require('path');

const vscode = require('vscode');

// Prompts the user for a workspace name and then creates it.
const createWorkspace = async (context, treeDataProvider) => {
  const inputResults = await vscode.window.showInputBox(
    {
      prompt: 'Enter a name for the workspace. The contents of your '
        + 'current Explorer window will be saved as the workspace. If '
        + 'the Explorer is empty you will be prompted to choose a folder.',
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
    const config = vscode.workspace.getConfiguration('workspaceExplorer');
    basePath = config.get('workspaceStorageDirectory');
  }

  // Build new workspace URI.
  const newWorkspaceUri = vscode.Uri.file(
    path.join(
      basePath,
      `${inputResults}.code-workspace`,
    ),
  );

  // Get Explorer Info
  let folderPaths;
  let workspaceFolders;
  workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders === undefined || workspaceFolders.length === 0) {
    // Get Folders from User as none are open in Explorer.
    workspaceFolders = [];
    let addAnother = true;
    while (workspaceFolders.length === 0 || addAnother) {
      const newFolder = await vscode.window.showOpenDialog(
        {
          canSelectFiles: false,
          canSelectFolders: true,
          canSelectMany: true,
        },
      );
  
      // Skip if nothing is entered.
      if (!newFolder && workspaceFolders.length === 0) {
        return;
      }

      if (!newFolder) {
        break;
      }

      // Add selected folder paths to list.
      newFolder.forEach((item) => workspaceFolders.push(item.fsPath));

      if (
        await vscode.window.showQuickPick(
          ['Add Another Folder', 'Done']
        ) === 'Add Another Folder'
      ) {
        addAnother = true;
      } else {
        addAnother = false;
      }
    }

    // Grab fsPath, name and index
    folderPaths = workspaceFolders.map((folder) => {
      return {
        path: folder,
      };
    });
  } else {
    // Get Folders from  workspace.
    folderPaths = workspaceFolders.map((folder) => {
      return {
        path: folder.uri.fsPath,
      };
    });
  }

  // Local workspace
  const workspaceFileContents = {
    folders: folderPaths,
    settings: {},
  };

  // Create workspace file.
  await vscode.workspace.fs.writeFile(
    newWorkspaceUri,
    Uint8Array.from(Buffer.from(JSON.stringify(workspaceFileContents, null, 4))),
  );

  // Refresh Tree
  treeDataProvider.refresh();
};

module.exports = createWorkspace;
