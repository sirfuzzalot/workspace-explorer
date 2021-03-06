// ------------------------------------------------------------------ //
// Main Extension module. Contains activate function,
// command registrations, and registers the Workspace Explorer
// data tree provider.
// ------------------------------------------------------------------ //

const fsPromises = require("fs").promises;

const path = require("path");

const vscode = require("vscode");

const WorkspaceTreeDataProvider = require("./workspaceTreeDataProvider");

const changeIcon = require("./changeIcon");

const addSubFolder = require("./addSubFolder");

const deleteFolder = require("./deleteFolder");

const createWorkspace = require("./createWorkspace");

const deleteWorkspace = require("./deleteWorkspace");

const renameTreeItem = require("./renameTreeItem");

const { selectWorkspace } = require("./openWorkspaceWithPalette");

// Activates the Extension when the Explorer view-container is open
// and the workspace explorer is expanded.
const activate = async () => {
  // Setup tree data structure
  const explorerTreeDataProvider = new WorkspaceTreeDataProvider();
  const quickPickNewWindowTreeDataProvider = new WorkspaceTreeDataProvider({
    workspaceIcon: "multiple-windows",
  });
  const quickPickSameWindowTreeDataProvider = new WorkspaceTreeDataProvider({
    workspaceIcon: "window",
  });

  // Grab the extension version from the package.json file and publish
  // it on key commands.
  let extensionVersion;
  try {
    const extensionRootPath = path.dirname(
      path.dirname(__filename)
    ); /* eslint no-undef: "off" */
    extensionVersion = JSON.parse(
      await fsPromises.readFile(
        path.join(extensionRootPath, "package.json"),
        "utf8"
      )
    ).version;

    // Register open in new window command.
    vscode.commands.registerCommand(
      "workspaceExplorer.openWorkspaceInNewWindow",
      (context) => {
        try {
          vscode.commands.executeCommand(
            "vscode.openFolder",
            vscode.Uri.file(context.workspaceFileNameAndFilePath),
            true
          );
        } catch (err) {
          vscode.window.showErrorMessage(err);
        }
      }
    );

    vscode.commands.registerCommand(
      "workspaceExplorer.openWorkspaceInNewWindowQuickPick",
      async () => {
        try {
          const workspace = await selectWorkspace(
            "Choose a workspace to switch to in a new window ...",
            quickPickNewWindowTreeDataProvider
          );
          if (!Object.keys(workspace).length) {
            return;
          }

          vscode.commands.executeCommand(
            "vscode.openFolder",
            vscode.Uri.file(workspace.workspaceFileNameAndFilePath),
            true
          );
        } catch (err) {
          vscode.window.showErrorMessage(err);
        }
      }
    );

    vscode.commands.registerCommand(
      "workspaceExplorer.openWorkspaceInSameWindowQuickPick",
      async () => {
        try {
          const workspace = await selectWorkspace(
            "Choose a workspace to switch to ...",
            quickPickSameWindowTreeDataProvider
          );
          if (!Object.keys(workspace).length) {
            return;
          }

          vscode.commands.executeCommand(
            "vscode.openFolder",
            vscode.Uri.file(workspace.workspaceFileNameAndFilePath),
            false
          );
        } catch (err) {
          vscode.window.showErrorMessage(err);
        }
      }
    );

    // Register open in same window command.
    vscode.commands.registerCommand(
      "workspaceExplorer.openWorkspaceInSameWindow",
      (workspaceFileNameAndFilePath) => {
        try {
          vscode.commands.executeCommand(
            "vscode.openFolder",
            vscode.Uri.file(workspaceFileNameAndFilePath),
            false
          );
        } catch (err) {
          vscode.window.showErrorMessage(err);
        }
      }
    );

    // Register Open Workspace Explorer Storage Directory Command.
    vscode.commands.registerCommand(
      "workspaceExplorer.openWorkspaceExplorerStorageDirectory",
      () => {
        try {
          const config = vscode.workspace.getConfiguration("workspaceExplorer");
          vscode.window.showOpenDialog({
            defaultUri: vscode.Uri.file(config.workspaceStorageDirectory),
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: true,
            filters: {
              "Workspaces and Images": ["svg", "png", "code-workspace"],
            },
          });
        } catch (err) {
          vscode.window.showErrorMessage(err);
        }
      }
    );

    // Setup TreeView
    vscode.window.createTreeView("workspaceExplorer", {
      showCollapseAll: true,
      treeDataProvider: explorerTreeDataProvider,
    });

    // TODO: Add default text in tree view. Awaiting API stablization
    // treeView.message = 'Choose a Workspace Storage Directory';

    // TODO: Add Configuration Change Listener

    // Register Add sub-folder Command.
    vscode.commands.registerCommand(
      "workspaceExplorer.addSubFolder",
      async (context) => {
        try {
          await addSubFolder(context, explorerTreeDataProvider);
        } catch (err) {
          vscode.window.showErrorMessage(err);
        }
      }
    );

    // Register Delete Folder Command.
    vscode.commands.registerCommand(
      "workspaceExplorer.deleteFolder",
      async (context) => {
        try {
          await deleteFolder(context, explorerTreeDataProvider);
        } catch (err) {
          vscode.window.showErrorMessage(err);
        }
      }
    );

    // Register Refresh Command.
    vscode.commands.registerCommand(
      "workspaceExplorer.refreshWorkspaceExplorer",
      () => {
        explorerTreeDataProvider.refresh();
        quickPickNewWindowTreeDataProvider.refresh();
        quickPickSameWindowTreeDataProvider.refresh();
      }
    );

    // Register Change Folder icon Command.
    vscode.commands.registerCommand(
      "workspaceExplorer.changeFolderIcon",
      async (e) => {
        try {
          await changeIcon(e, explorerTreeDataProvider);
        } catch (err) {
          vscode.window.showErrorMessage(err);
        }
      }
    );

    // Register Change Workspace icon Command.
    vscode.commands.registerCommand(
      "workspaceExplorer.changeWorkspaceIcon",
      async (e) => {
        try {
          await changeIcon(e, explorerTreeDataProvider);
        } catch (err) {
          vscode.window.showErrorMessage(err);
        }
      }
    );

    // Register Create Workspace Command.
    vscode.commands.registerCommand(
      "workspaceExplorer.createWorkspace",
      async (e) => {
        try {
          await createWorkspace(e, explorerTreeDataProvider);
        } catch (err) {
          vscode.window.showErrorMessage(err);
        }
      }
    );

    // Register Delete Workspace Command.
    vscode.commands.registerCommand(
      "workspaceExplorer.deleteWorkspace",
      async (e) => {
        try {
          await deleteWorkspace(e, explorerTreeDataProvider);
        } catch (err) {
          vscode.window.showErrorMessage(err);
        }
      }
    );

    // Register Rename Command.
    vscode.commands.registerCommand("workspaceExplorer.rename", async (e) => {
      try {
        await renameTreeItem(e, explorerTreeDataProvider);
      } catch (err) {
        vscode.window.showErrorMessage(err);
      }
    });

    console.log(
      `[vscode-workspace-explorer] ${extensionVersion} ==> Activated`
    );
  } catch (err) {
    vscode.window.showErrorMessage(err);
  }
};

exports.activate = activate;
