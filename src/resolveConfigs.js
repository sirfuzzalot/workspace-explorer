/**
 * Get, resolve and validate the extension's user entered configs.
 * Prompt users to enter or correct information when needed.
 */

const vscode = require('vscode');

const resolveTemplatePath = require('./resolveTemplatePath');

const promptForFilePath = async (
  extensionConfig,
  message,
  configName,
  configDisplayName,
) => {
  const results = await vscode.window.showWarningMessage(
    message,
    ...['Choose a Directory', 'Enter a Template Path'],
  );
  if (results === 'Choose a Directory') {
    const userFolder = await vscode.window.showOpenDialog(
      {
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
      },
    );
    if (userFolder) {
      await extensionConfig.update(
        configName,
        userFolder[0].fsPath,
        vscode.ConfigurationTarget.Global,
      );
    }
  } else if (results === 'Enter a Template Path') {
    const inputResults = await vscode.window.showInputBox(
      {
        prompt: `Enter a file system path for your ${configDisplayName}. `
        + 'Environment variable substitution is supported. '
        + 'Ex: ${env:USERPROFILE} or ${env:HOME}/workspaces .',
      },
    );

    if (inputResults) {
      await extensionConfig.update(
        configName,
        inputResults,
        vscode.ConfigurationTarget.Global,
      );
    }
  }
};

const resolveWorkspaceStorageDirectory = async (
  extensionConfig,
  refreshFunction,
) => {
  const wsdPath = extensionConfig.workspaceStorageDirectory;
  if (wsdPath === '') {
    const message = (
      'Workspace Explorer: You must set the workspace '
      + 'storage directory to use the Workspace Explorer. '
      + 'This is the directory where you want to keep your '
      + 'workspace configuration files.'
    );
    await promptForFilePath(
      extensionConfig,
      message,
      'workspaceStorageDirectory',
      'Workspace Storage Directory',
    );

    setTimeout(refreshFunction, 100);
    return;
  }

  try {
    return resolveTemplatePath(wsdPath);
  } catch (err) {
    if (err.name === 'InvalidTemplateStringError') {
      const message = (
        'Workspace Explorer: The workspace storage directory path is '
        + 'invalid. Please enter a new path.'
      );
      await promptForFilePath(
        extensionConfig,
        message,
        'workspaceStorageDirectory',
        'Workspace Storage Directory',
      );
      setTimeout(refreshFunction, 100);
      return;
    }

    throw err;
  }
};

const resolveAdditionalCustomIconDirectory = async (
  extensionConfig,
  refreshFunction,
) => {
  const acidPath = extensionConfig.additionalCustomIconDirectory;
  try {
    return resolveTemplatePath(acidPath);
  } catch (err) {
    if (err.name === 'InvalidTemplateStringError') {
      const message = (
        'Workspace Explorer: The additional custom icon directory path is '
        + 'invalid. Please enter a new path.'
      );
      await promptForFilePath(
        extensionConfig,
        message,
        'additionalCustomIconDirectory',
        'Additional Custom Icon Directory',
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
const resolveConfigs = async (refreshFunction) => {
  const extensionConfig = vscode.workspace.getConfiguration(
    'workspaceExplorer',
  );

  const resolvedConfig = {
    enableCustomIconSearch: extensionConfig.enableCustomIconSearch,
    additionalCustomIconDirectory: extensionConfig.additionalCustomIconDirectory,
  };

  resolvedConfig.workspaceStorageDirectory = await resolveWorkspaceStorageDirectory(
    extensionConfig,
    refreshFunction,
  );
  if (
    extensionConfig.enableCustomIconSearch === true
    && extensionConfig.additionalCustomIconDirectory !== ''
  ) {
    resolvedConfig.additionalCustomIconDirectory = await resolveAdditionalCustomIconDirectory(
      extensionConfig,
      refreshFunction,
    );
  }

  return resolvedConfig;
};

module.exports = resolveConfigs;
