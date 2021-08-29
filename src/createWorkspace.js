const path = require('path');

const vscode = require('vscode');

// Prompts the user for a workspace name and then creates it.
const createWorkspace = async (context, treeDataProvider) => {
  const inputResults = await vscode.window.showInputBox(
    {
      prompt: 'Enter a name for the workspace. The contents of your '
      + 'current file browser panel will be set as the workspace. If '
      + 'the file browser panel is empty you will be prompted to choose '
      + 'a folder.',
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
  let remoteAuthority;
  workspaceFolders = vscode.workspace.workspaceFolders;

  if (workspaceFolders === undefined || workspaceFolders.length === 0) {
    // Get Folders from User as none are open in Explorer.
    workspaceFolders = [];
    let addAnother = true;
    while (workspaceFolders.length === 0 || addAnother) {
      // Opens locally for desktop users. This will not work for desktop remote.
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
          ['Add Another Folder', 'Done'],
        ) === 'Add Another Folder'
      ) {
        addAnother = true;
      } else {
        addAnother = false;
      }
    }

    // Build file path for addition to workspace file.
    folderPaths = workspaceFolders.map((folder) => ({ path: folder }));
  } else {
    // Get folders from currently opened folders.
    folderPaths = workspaceFolders.map((folder) => {
      if (folder.uri.scheme === 'vscode-remote') {
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

  const workspaceFileContents = {
    folders: folderPaths,
    settings: {},
  };
  if (remoteAuthority) {
    workspaceFileContents.remoteAuthority = remoteAuthority;
  }

  // Create workspace file.
  await vscode.workspace.fs.writeFile(
    newWorkspaceUri,
    Uint8Array.from(Buffer.from(JSON.stringify(workspaceFileContents, null, 4))),
  );

  treeDataProvider.refresh();
};

module.exports = createWorkspace;
