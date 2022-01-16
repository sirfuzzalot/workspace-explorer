const vscode = require("vscode");
const selectWorkspace = async (placeHolder, tree, node) => {
  const workspaceEntries = await tree.getChildren(node);

  if (!workspaceEntries) {
    vscode.window.showInformationMessage("No workspaces found");
    return {};
  }

  const options = {
    matchOnDescription: false,
    matchOnDetail: false,
    placeHolder,
  };

  const selectedItem = await vscode.window.showQuickPick(
    workspaceEntries,
    options
  );
  if (!selectedItem) {
    return {};
  }

  if (selectedItem.collapsableState === 1) {
    return selectWorkspace(placeHolder, tree, selectedItem);
  }

  return selectedItem;
};

module.exports = {
  selectWorkspace,
};
