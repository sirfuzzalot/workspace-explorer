# Change Log
All notable changes to the "vscode-workspace-explorer" extension will be documented in this file.

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
