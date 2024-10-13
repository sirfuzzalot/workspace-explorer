import vscode from "vscode";
import WorkspaceTreeDataProvider from "./workspaceTreeDataProvider";
import WorkspaceTreeItem from "./workspaceTreeItem";

export async function selectWorkspace(
  placeHolder: string,
  tree: WorkspaceTreeDataProvider,
  node: WorkspaceTreeItem | undefined
) {
  const workspaceEntries = await tree.getChildren(node);

  if (!workspaceEntries) {
    vscode.window.showInformationMessage("No workspaces found");
    return;
  }

  const options = {
    matchOnDescription: false,
    matchOnDetail: false,
    placeHolder,
  };

  // @ts-ignore - pass TreeItems to ensure we get the collapsibleState and can
  // traverse the tree.
  const selectedItem: WorkspaceTreeItem | undefined =
    await vscode.window.showQuickPick(
      // @ts-ignore
      workspaceEntries,
      options
    );
  if (!selectedItem) {
    return;
  }

  if (
    selectedItem.collapsibleState === vscode.TreeItemCollapsibleState.Collapsed
  ) {
    return selectWorkspace(placeHolder, tree, selectedItem);
  }

  return selectedItem;
}
