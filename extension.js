// ------------------------------------------------------------------ //
// Main Extension module. Contains activate function,
// command registrations, and registers the Workspace Explorer
// data tree provider.
// ------------------------------------------------------------------ //

const vscode = require('vscode');
const { spawn } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { WorkspaceTreeDataProvider } = require('./workspaceDataTreeProvider');

// Activates the Extension when the Explorer view-container is open
// and the workspace explorer is expanded.
function activate() {
  // Grab the extension version from the package.json file and publish
  // it on key commands.
  const extensionVersion = JSON.parse(
    fs.readFileSync(
      path.join(
        path.dirname(__filename),
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
    applicationName = 'vscodium';
  } else {
    applicationName = 'code';
  }

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

  // Register Refresh Command.
  vscode.commands.registerCommand(
    'workspaceExplorer.refreshWorkspaceExplorer',
    () => {
      console.log(
        `[vscode-workspace-explorer] ${extensionVersion} `
            + '==> Refreshing Workspace Explorer',
      );
      dataTreeProvider.refresh();
    },
  );

  // Register Settings Command.
  vscode.commands.registerCommand(
    'workspaceExplorer.openWorkspaceExplorerSettings',
    () => {
      console.log(
        `[vscode-workspace-explorer] ${extensionVersion} `
            + '==> Opening Settings for Workspace Explorer',
      );
      vscode.commands.executeCommand('workbench.action.openSettings2');
    },
  );

  // Build tree structure.
  const dataTreeProvider = new WorkspaceTreeDataProvider();
  vscode.window.registerTreeDataProvider(
    'workspaceExplorer', dataTreeProvider,
  );
}
exports.activate = activate;
