# Change Log
All notable changes to the "workspace-explorer" extension will be documented in this file.

## 2.1.0
* Added experimental support for opening workspaces via command palette. PR by @fhemberger.
* Migrated Git repo from GitLab to GitHub

## 2.0.0
* Removed support for `.svg` icons.
* Added support for `.jpg` icons.
* Added support for environment variables in config paths, using template syntax.
* Added clearer workspace save prompt.
* Removed all command palette commands. These were unsupported.
* Removed unused imports in `extension.js`.

## 1.7.0
* Moved Workspaces View to a new Workspaces view container to allow for addition of views and more screen space for large collections of workspaces.
* Added icon for view container - https://github.com/microsoft/vscode-icons/blob/master/icons/light/multiple-windows.svg?short_path=2859a0a
* Updated Docs and doc gifs to reflect the new location of the Workspaces view.

## 1.6.2
* Patched workspaceExplorer.openWorkspaceInSameWindow and workspaceExplorer.openWorkspaceInNewWindow commands to use existing VSCode internal commands. This fixes an issue in the browser version of VSCode. This also removes the dependency
on having `code` in your system `$PATH`.
* Removed sections in `extension.js` that referred to `applicationName`,
which was used to open a new or existing window of code via command line.
* Updated dev dependencies. Removed `vscode`, and `@types/mocha`. Added `@types/vscode` and `vscode-test`. Updated `@types/node`, `eslint`, `eslint-config-airbnb-base`, and `eslint-plugin-import`.
* Removed Requirements section from README after removing dependency on `code` in system path.
* Updated version of VSCode required as I'm not sure when vscode.openFolder command was introduced.

## 1.6.1
* Updated docs with information about new marketplace name

## 1.6.0
* When workspace storage directory has not been entered the notification dialog will now provide an option to choose the workspace by opening a file dialog.
* Updated Change Icon to force reload icons that are overwritten by the user

## 1.5.0
* Added Container Development Environment
* Enabled multi-select in Open Workspace Storage Directory dialog.
* Added Experimantal Create Workspace right click option.
* Added Experimental Create Workspace button on the Workspace Explorer navigation menu.
* Added Delete right click option. Works for both folders and workspaces.
* Added Create Sub-folder right click option.
* Added Create Sub-folder button on the Workspace Explorer navigation menu.
* Added Rename right click options. Works for both folders and workspaces.
* Updated Enable Custom Icon Search Configuration to be enabled by default

## 1.4.1
* Fix for POSIX style pathing on extension load that would prevent the extension from finding its version.

## 1.4.0
* Added Open workspace storage directory button.
* Added Collapse All button
* Add Change Icon option in right click menu
* Removed Settings button.
* Updated Requirements Section of README
* Fixed support for VSCodium to call **codium** when changing workspace.
* Refactored extension code. Breaking it into additional modules.
* Added Create Subfolder in Folder Right Click menu - DISABLED until [drag and drop](https://github.com/microsoft/vscode/issues/32592) arrives in VSCode API

## 1.3.0
* Updated default icon sets to use default icons from [VSCode](https://github.com/microsoft/vscode-icons).

## 1.2.2
* Migrated repository to new home.

## 1.2.1
* Fixed docs Requirements section to note additional versions of VSCode.

## 1.2.0
* Added support for VSCodium and VSCode OSS. Thanks to @stripedpajamas
for the contribution and @camlafit for the issue.

## 1.1.0
* Updated workspaceDataTreeProvider.js to support symlinks. Thanks to
@Xaryphon for providing the initial version of the code for this feature.

## 1.0.3
* Updated .vscodeignore to not include animations.

## 1.0.2
* Added additional details to docs

## 1.0.0
* Initial release
