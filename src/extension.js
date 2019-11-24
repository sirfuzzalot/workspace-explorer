// ------------------------------------------------------------------ //
// Main Extension module. Contains activate function,
// command registrations, and registers the Workspace Explorer
// data tree provider.
// ------------------------------------------------------------------ //

const { spawn } = require('child_process');

const os = require('os');

const fs = require('fs');

const path = require('path');

const vscode = require('vscode');

const { WorkspaceTreeDataProvider } = require('./workspaceTreeDataProvider');

// const { addSubFolder } = require('./addSubFolder');

const { changeIcon } = require('./changeIcon');

// Activates the Extension when the Explorer view-container is open
// and the workspace explorer is expanded.
function activate() {
  // Grab the extension version from the package.json file and publish
  // it on key commands.
  const extensionRootPath = path.dirname(__filename).split(path.sep);
  extensionRootPath.pop();
  const extensionVersion = JSON.parse(
    fs.readFileSync(
      path.join(
        ...extensionRootPath,
        'package.json',
      ),
      'utf8',
    ),
  ).version;

  console.log(
    `[vscode-workspace-explorer] ${extensionVersion} ==> Activated`,
  );


  // Identify which application to use.
  let applicationName;
  if (vscode.env.appName === 'Visual Studio Code - Insiders') {
    applicationName = 'code-insiders';
  } else if (vscode.env.appName === 'Code - OSS') {
    applicationName = 'code-oss';
  } else if (vscode.env.appName === 'VSCodium') {
    applicationName = 'codium';
  } else {
    applicationName = 'code';
  }

  // TODO: Add check for code in path.

  // Register open in new window command.
  vscode.commands.registerCommand(
    'workspaceExplorer.openWorkspaceInNewWindow',
    (context) => {
      console.log(
        `[vscode-workspace-explorer] ${extensionVersion} ==> Opening `
            + `${context.workspaceFileNameAndFilePath} in a new window.`,
      );
      const results = spawn(
        applicationName,
        [`"${context.workspaceFileNameAndFilePath}"`],
        { cwd: os.homedir(), detached: true, shell: true },
      );

      results.stdout.on('data', (data) => {
        console.log(`stdout ${data}`);
      });
    },
  );

  // Register open in same window command.
  vscode.commands.registerCommand(
    'workspaceExplorer.openWorkspaceInSameWindow',
    (workspaceFileNameAndFilePath) => {
      console.log(
        `[vscode-workspace-explorer] ${extensionVersion} `
                + '==> Opening '
                + `${workspaceFileNameAndFilePath} in this window.`,
      );
      spawn(
        applicationName,
        ['-r', `"${workspaceFileNameAndFilePath}"`],
        { cwd: os.homedir(), detached: true, shell: true },
      );
    },
  );


  // Register Open Workspace Explorer Storage Directory Command.
  vscode.commands.registerCommand(
    'workspaceExplorer.openWorkspaceExplorerStorageDirectory',
    () => {
      console.log(
        `[vscode-workspace-explorer] ${extensionVersion} `
            + '==> Open the Workspace Explorer Storage Directory',
      );
      const config = vscode.workspace.getConfiguration(
        'workspaceExplorer',
      );
      vscode.window.showOpenDialog(
        {
          defaultUri: vscode.Uri.file(config.workspaceStorageDirectory),
          canSelectFiles: false,
          canSelectFolders: false,
          filters: {
            'Workspaces and Images': ['svg', 'png', 'code-workspace'],
          },
        },
      );
    },
  );

  // Setup TreeView and tree data structure
  const treeDataProvider = new WorkspaceTreeDataProvider();
  vscode.window.createTreeView(
    'workspaceExplorer',
    {
      showCollapseAll: true,
      treeDataProvider,
    },
  );

  // Awaiting API stablization
  // treeView.message = 'Choose a Workspace Storage Directory';

  // Register Add sub-folder Command.
  // TODO: Disabled Until Drag and Drop can be implemented in TreeView API
  // vscode.commands.registerCommand(
  //   'workspaceExplorer.addSubFolder',
  //   async (context) => {
  //     try {
  //       console.log(
  //         `[vscode-workspace-explorer] ${extensionVersion} `
  //             + '==> Add sub-folder',
  //       );

  //       await addSubFolder(context, treeDataProvider);
  //     } catch (err) {
  //       console.error(err);
  //       vscode.window.showErrorMessage(err);
  //     }
  //   },
  // );

  // Register Refresh Command.
  vscode.commands.registerCommand(
    'workspaceExplorer.refreshWorkspaceExplorer',
    () => {
      console.log(
        `[vscode-workspace-explorer] ${extensionVersion} `
            + '==> Refreshing Workspace Explorer',
      );
      treeDataProvider.refresh();
    },
  );

  // Register Change Folder icon Command.
  vscode.commands.registerCommand(
    'workspaceExplorer.changeFolderIcon',
    async (e) => {
      try {
        console.log(
          `[vscode-workspace-explorer] ${extensionVersion} `
              + '==> Changing Folder Icon',
        );
        await changeIcon(e, treeDataProvider);
      } catch (err) {
        vscode.window.showErrorMessage(err);
      }
    },
  );

  // Register Change Workspace icon Command.
  vscode.commands.registerCommand(
    'workspaceExplorer.changeWorkspaceIcon',
    async (e) => {
      try {
        console.log(
          `[vscode-workspace-explorer] ${extensionVersion} `
              + '==> Changing Workspace Icon',
        );
        await changeIcon(e, treeDataProvider);
      } catch (err) {
        vscode.window.showErrorMessage(err);
      }
    },
  );
}

exports.activate = activate;
