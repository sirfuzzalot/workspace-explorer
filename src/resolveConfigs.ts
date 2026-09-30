/**
 * Get, resolve and validate the extension's user entered configs.
 * Prompt users to enter or correct information when needed.
 */

import vscode from "vscode";
import resolveTemplatePath from "./resolveTemplatePath";
import { InvalidTemplateStringError } from "./resolveTemplatePath";

export type ClickAction = "newWindow" | "sameWindow" | "none";

export interface ResolvedExtensionConfig {
  enableCustomIconSearch: boolean;
  additionalCustomIconDirectory: string;
  workspaceStorageDirectory: string;
  clickAction: ClickAction;
  buttonAction: ClickAction;
  showOpenIndicator: boolean;
  openIndicatorColorEnabled: boolean;
  openIndicatorIconEnabled: boolean;
  currentWorkspaceColor: string;
  openWorkspaceColor: string;
  currentWorkspaceIcon: string;
  openWorkspaceIcon: string;
}

let isShowingConfigPrompt = false;
const dismissedConfigPrompts = new Set<string>();

const promptForFilePath = async (
  extensionConfig: vscode.WorkspaceConfiguration,
  message: string,
  configName: string,
  configDisplayName: string,
) => {
  if (isShowingConfigPrompt) {
    return;
  }

  if (dismissedConfigPrompts.has(configName)) {
    return;
  }

  try {
    isShowingConfigPrompt = true;
    const results = await vscode.window.showWarningMessage(
      message,
      ...["Choose a Directory", "Enter a Template Path"],
    );
    if (results === undefined) {
      dismissedConfigPrompts.add(configName);
      return;
    }
    if (results === "Choose a Directory") {
      const userFolder = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
      });
      if (userFolder) {
        await extensionConfig.update(
          configName,
          userFolder[0].fsPath,
          vscode.ConfigurationTarget.Global,
        );
      }
    } else if (results === "Enter a Template Path") {
      const inputResults = await vscode.window.showInputBox({
        prompt:
          `Enter a file system path for your ${configDisplayName}. ` +
          "Environment variable substitution is supported. " +
          "Ex: ${env:USERPROFILE} or ${env:HOME}/workspaces .",
      });

      if (inputResults) {
        await extensionConfig.update(
          configName,
          inputResults,
          vscode.ConfigurationTarget.Global,
        );
      }
    }
  } finally {
    isShowingConfigPrompt = false;
  }
};

const resolveWorkspaceStorageDirectory = async (
  extensionConfig: vscode.WorkspaceConfiguration,
  refreshFunction: (targetIconUri?: vscode.Uri) => void,
) => {
  const wsdPath = extensionConfig.workspaceStorageDirectory;
  if (wsdPath === "") {
    const message =
      "Workspace Explorer: You must set the workspace " +
      "storage directory to use the Workspace Explorer. " +
      "This is the directory where you want to keep your " +
      "workspace configuration files.";
    await promptForFilePath(
      extensionConfig,
      message,
      "workspaceStorageDirectory",
      "Workspace Storage Directory",
    );

    setTimeout(refreshFunction, 100);
    return "";
  }

  try {
    return resolveTemplatePath(wsdPath);
  } catch (err) {
    if (err instanceof InvalidTemplateStringError) {
      const message =
        "Workspace Explorer: The workspace storage directory path is " +
        "invalid. Please enter a new path.";
      await promptForFilePath(
        extensionConfig,
        message,
        "workspaceStorageDirectory",
        "Workspace Storage Directory",
      );
      setTimeout(refreshFunction, 100);
      return "";
    }

    throw err;
  }
};

const resolveAdditionalCustomIconDirectory = async (
  extensionConfig: vscode.WorkspaceConfiguration,
  refreshFunction: (targetIconUri?: vscode.Uri) => void,
) => {
  const acidPath = extensionConfig.additionalCustomIconDirectory;
  try {
    return resolveTemplatePath(acidPath);
  } catch (err) {
    if (err instanceof InvalidTemplateStringError) {
      const message =
        "Workspace Explorer: The additional custom icon directory path is " +
        "invalid. Please enter a new path.";
      await promptForFilePath(
        extensionConfig,
        message,
        "additionalCustomIconDirectory",
        "Additional Custom Icon Directory",
      );
      setTimeout(refreshFunction, 100);
    } else {
      throw err;
    }
  }
};

/**
 * Get a validate the extensions user entered configs. Prompt users
 * to enter or correct information when needed.
 * @param {function} refreshFunction - refresh callback. Invoked when a
 *    setting is updated.
 * @returns {Object} - extension config object containing resolved and
 *    validated configuration values from those provided by the user
 */
export default async function (
  refreshFunction: (targetIconUri?: vscode.Uri) => void,
) {
  const extensionConfig =
    vscode.workspace.getConfiguration("workspaceExplorer");

  const workspaceStorageDirectory = await resolveWorkspaceStorageDirectory(
    extensionConfig,
    refreshFunction,
  );

  const clickAction: ClickAction =
    extensionConfig.get<ClickAction>("clickAction") ?? "sameWindow";
  const buttonAction: ClickAction =
    extensionConfig.get<ClickAction>("buttonAction") ?? "newWindow";

  const showOpenIndicator: boolean =
    extensionConfig.get<boolean>("showOpenIndicator") ?? true;
  const openIndicatorColorEnabled: boolean =
    extensionConfig.get<boolean>("openIndicatorColorEnabled") ?? true;
  const openIndicatorIconEnabled: boolean =
    extensionConfig.get<boolean>("openIndicatorIconEnabled") ?? true;
  const currentWorkspaceColor: string =
    extensionConfig.get<string>("currentWorkspaceColor") ?? "charts.green";
  const openWorkspaceColor: string =
    extensionConfig.get<string>("openWorkspaceColor") ?? "charts.blue";
  const currentWorkspaceIcon: string =
    extensionConfig.get<string>("currentWorkspaceIcon") ?? "arrow-circle-right";
  const openWorkspaceIcon: string =
    extensionConfig.get<string>("openWorkspaceIcon") ?? "circle-large-outline";

  const resolvedConfig: ResolvedExtensionConfig = {
    enableCustomIconSearch: extensionConfig.enableCustomIconSearch,
    additionalCustomIconDirectory:
      extensionConfig.additionalCustomIconDirectory,
    workspaceStorageDirectory,
    clickAction,
    buttonAction,
    showOpenIndicator,
    openIndicatorColorEnabled,
    openIndicatorIconEnabled,
    currentWorkspaceColor,
    openWorkspaceColor,
    currentWorkspaceIcon,
    openWorkspaceIcon,
  };
  if (
    extensionConfig.enableCustomIconSearch === true &&
    extensionConfig.additionalCustomIconDirectory !== ""
  ) {
    const resolvedAdditionalCustomIconDirectory =
      await resolveAdditionalCustomIconDirectory(
        extensionConfig,
        refreshFunction,
      );
    resolvedConfig.additionalCustomIconDirectory =
      resolvedAdditionalCustomIconDirectory || "";
  }

  return resolvedConfig;
}
