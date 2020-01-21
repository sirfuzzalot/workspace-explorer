# Introduction
Workspace Explorer provides a convenient UI to quickly switch your
workspace or open a workspace in a new window.

<a href="https://gitlab.com/tomsaunders-tools/vscode-workspace-explorer/raw/master/resources/images/openWorkspace.gif"><img alt="Opening a workspace using the explorer" src="https://gitlab.com/tomsaunders-tools/vscode-workspace-explorer/raw/master/resources/images/openWorkspace_lowres.gif" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"></a>

# Getting Started
I should note before we dive into setup, VSCode currently allows you to **only have one instance of
a workspace open at a time**, i.e. your **node.code-workspace** can only be open
in one window of VSCode.

<a href="https://gitlab.com/tomsaunders-tools/vscode-workspace-explorer/raw/master/resources/images/workspaceStorageDirectory.gif"><img alt="Setting up the workspace explorer storage directory configuration" src="https://gitlab.com/tomsaunders-tools/vscode-workspace-explorer/raw/master/resources/images/workspaceStorageDirectory_480p.gif" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"></a>

Five quick steps to get you up and running:
1. Install the Workspace Explorer extension.
2. Add a directory to the **Workspace Explorer: Workspace Storage Directory** setting.
    * On Windows/Linux - **File > Preferences > Settings > search "Workspace Explorer"**.
    * On Mac - **Code > Preferences > Settings > search "Workspace Explorer"**.
3. Add your existing **.code-workspace** files or save a new workspace to the **Workspace Storage Directory**.
4. Open the Workspace Explorer by clicking on the **WORKSPACES** title towards the bottom of the Explorer section of VSCode.
5. Hit the **refresh** icon that appears when you hover over the **WORKSPACES** title.


# Features
Workspace Explorer allows you to have quick access to all your workspaces
in one convenient UI.

* Sub-Folders
    * [Organize in Sub-folders](#creating-sub-folders)
    * [Delete Sub-folders](#deleting-folders)
    * [Rename Sub-Folders](#renaming-folders)
* Workspaces
    * [Create Workspaces](#creating-a-workspace)
    * [Delete Workspaces](#deleting-a-workspace)
    * [Rename Workspaces](#renaming-a-workspace)
* Custom Icons
    * [Set Custom Icons](#setting-custom-icons)
    * [Additional Icons Directory](#additional-custom-icons-directory)

## Creating Sub-folders
Organize your **.code-workspace** files as much as you want within the
**Workspace Explorer: Workspace Storage Directory**. Sub-folders will be listed in the Workspace Explorer. Click on the arrow
to expand the directory and reveal any deeper sub-folders or workspaces.

There are at least three ways to create a sub-folder:

1. Clicking on the **Create Sub-folder** button on the Workspace Explorer title menu (right next to where it says WORKSPACES). This will create one directly in the Workspace Storage Directory.
2. Right clicking on a folder in the Workspace Explorer > **Create Sub-folder**.
3. Through the **Open Workspace Storage Directory** button where you can then create a sub-folder using the standard OS menus.

<a href="https://gitlab.com/tomsaunders-tools/vscode-workspace-explorer/raw/master/resources/images/createSubFolder.gif"><img alt="Creating Sub-folders" src="https://gitlab.com/tomsaunders-tools/vscode-workspace-explorer/raw/master/resources/images/createSubFolder_480p.gif" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"></a>

## Deleting Folders
Workspace Explorer also allows you to remove unwanted sub-folders.

There are at least two ways to remove a sub-folder:

1. Right clicking on a folder in the Workspace Explorer > **Delete**.
2. Through the **Open Workspace Storage Directory** button where you can then remove a folder using the standard OS menus.

<a href="https://gitlab.com/tomsaunders-tools/vscode-workspace-explorer/raw/master/resources/images/deleteFolder.gif"><img alt="Creating Sub-folders" src="https://gitlab.com/tomsaunders-tools/vscode-workspace-explorer/raw/master/resources/images/deleteFolder_480p.gif" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"></a>

## Renaming Folders
Workspace Explorer also allows you to rename sub-folders.

There are at least two ways to rename a sub-folder:

1. Right clicking on a folder in the Workspace Explorer > **Rename**.
2. Through the **Open Workspace Storage Directory** button where you can then rename a folder using the standard OS menus.

<a href="https://gitlab.com/tomsaunders-tools/vscode-workspace-explorer/raw/master/resources/images/renameFolder.gif"><img alt="Creating Sub-folders" src="https://gitlab.com/tomsaunders-tools/vscode-workspace-explorer/raw/master/resources/images/renameFolder_480p.gif" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"></a>

## Creating a Workspace
Create a new workspace from the contents of your Explorer panel or choose
folders to build a workspace from scratch.

1. Root: Create a workspace at the root of your Workspace Storage Directory by clicking on the **Create Workspace button** on the Workspace Explorer navigation bar.
2. Subfolder: Create a workspace in a sub-folder of your Workspace Storage Directory by **right clicking on the sub-folder** and choosing **Create Workspace**.
3. Anywhere: Save a workspace in you Workspace Storage Directory using VSCode's File or Code menu > **Save Workspace As**

<a href="https://gitlab.com/tomsaunders-tools/vscode-workspace-explorer/raw/master/resources/images/createWorkspace.gif"><img alt="Creating Sub-folders" src="https://gitlab.com/tomsaunders-tools/vscode-workspace-explorer/raw/master/resources/images/createWorkspace_480p.gif" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"></a>

## Deleting a Workspace
Remove a workspace simply by right clicking on it in the Workspace Explorer and choosing **Delete**.

<a href="https://gitlab.com/tomsaunders-tools/vscode-workspace-explorer/raw/master/resources/images/deleteWorkspace.gif"><img alt="Creating Sub-folders" src="https://gitlab.com/tomsaunders-tools/vscode-workspace-explorer/raw/master/resources/images/deleteWorkspace_480p.gif" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"></a>

## Renaming a Workspace
Workspace Explorer also allows you to rename workspaces.

There are at least two ways to rename a workspace:

1. Right clicking on a workspace in the Workspace Explorer > **Rename**.
2. Through the **Open Workspace Storage Directory** button where you can then rename a workspace using the standard OS menus.

<a href="https://gitlab.com/tomsaunders-tools/vscode-workspace-explorer/raw/master/resources/images/renameWorkspace.gif"><img alt="Creating Sub-folders" src="https://gitlab.com/tomsaunders-tools/vscode-workspace-explorer/raw/master/resources/images/renameWorkspace_480p.gif" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"></a>

## Setting Custom Icons
Workspace Explorer comes with two default icons. One for sub-folders
and one for workspaces. Adding custom icons is a great way to further
organize and quickly recognize your workspaces/sub-folders.

You can add icons in one of three ways:

1. Right clicking on a workspace or folder in **Workspace Explorer** and choosing **Change Folder Icon** or **Change Workspace Icon**.
2. Through the **Open Workspace Storage Directory** button
    1. **Click** the button
    2. **Copy** the desired **.svg** or **.png** into the same directory as your folder or workspace that you want the icon for. **Ex: "Webserver Configs.code-workspace" ==> "Webserver Configs.svg".**
    3. **Rename** the icon to the name of the workspace or folder.
    4. **Refresh** the Workspace Explorer using the **Refresh** button
3. Use an additional icons folder (See [Additional Custom Icons Directory](#additional-custom-icons-directory))
    
<a href="https://gitlab.com/tomsaunders-tools/vscode-workspace-explorer/raw/master/resources/images/changeIcon.gif"><img alt="Creating Sub-folders" src="https://gitlab.com/tomsaunders-tools/vscode-workspace-explorer/raw/master/resources/images/changeIcon_480p.gif" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"></a>

## Additional Custom Icons Directory
Workspace Explorer also allows you to add an additional custom icons
directory. It first searches the **Workspace Storage Directory**. If it
then cannot find the image file (see Option One for how to name images
and where to put them) then it will search the **Additional Custom Icon Directory**.
It will only search one level of the directory (no sub-directories). If
no icon is found at that point, default icons are used.

<a href="https://gitlab.com/tomsaunders-tools/vscode-workspace-explorer/raw/master/resources/images/additionalCustomIconDirectory.gif"><img alt="Enabling the custom icon configuration." src="https://gitlab.com/tomsaunders-tools/vscode-workspace-explorer/raw/master/resources/images/additionalCustomIconDirectory_lowres.gif" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"></a>

Enabling the **Additional Custom Icon Directory**
1. Ensure the **Workspace Explorer: Enable Custom Icon Search** setting
is enabled. It is enabled by default.
2. Add a path to the **Workspace Explorer: Additional Custom Icon Directory**
setting.
3. Hit the **refresh** icon on the Workspace Explorer.

# Requirements
Workspace Explorer requires that **code**, **code-insiders**,
**code-oss**, or **codium** be added
to the **$PATH** environment variable.
* When opening a new window or switching
the workspace in the existing window it will use these key words to run
the application via command-line.

If working on **MacOS** run the Command Palette Command **Install code command in Path**

The easiest way to test this is to open a terminal/cmd/bash and type `code` or your
specific flavor. See above. If VSCode opens then it's working. Otherswise you can do
the following.
* If on MacOS run the Command Palette Command **Install code command in Path**
* Reboot
* Reinstall VSCode and Reboot (for most OS's `code` is setup in the install).

# Extension Settings
Workspace Explorer contributes the following settings:

* `workspaceExplorer.workspaceStorageDirectory`

    The root directory containing your **.code-workspace** files.
    Workspace Explorer will show you any **.code-workspace's** in this
    directory and will also display any **sub-folders**. This will allow
    you to organize your workspaces into categories by sub-folder.
    **Ex: C:\\Users\\appuser\\workspaces**

* `workspaceExplorer.enableCustomIconSearch`

    Allow Workspace Explorer to search for **.svg** and **.png** files with
    the same name as your workspaces and folders. Then to use those
    as icons in the Workspace Explorer. The search path defaults to
    the same location as your workspace file. An additional search
    directory can be added in the
    **Workspace Explorer: Additional Custom Icon Directory** setting.

* `workspaceExplorer.additionalCustomIconDirectory`

    Give Workspace Explorer an additional search directory
    for **.svg** and **.png** files with the same name as
    your workspaces and folders. Then use those as icons in the
    Workspace Explorer. Workspace Explorer will first look in
    the **Workspace Storage Directory** and then will look in
    the **Additional Custom Icon Directory**. Ex: C:\\Users\\appuser\\icons

# Known Issues

* No support for [ENV variables](https://gitlab.com/tomsaunders-tools/vscode-workspace-explorer/issues/2) in configured file paths.

# Release Notes

## 1.6.0
* When workspace storage directory has not been entered the notification dialog will now provide an option to choose the workspace by opening a file dialog.
* Updated Change Icon to force reload icons that are overwritten by the user

## 1.5.0
* Added Experimantal Create Workspace right click option.
* Added Experimental Create Workspace button on the Workspace Explorer navigation menu.
* Added Delete right click option. Works for both folders and workspaces.
* Added Create Sub-folder right click option.
* Added Create Sub-folder button on the Workspace Explorer navigation menu.
* Added Rename right click options. Works for both folders and workspaces.
* Updated Enable Custom Icon Search Configuration to be enabled by default

## 1.4.1
* Fix for POSIX style pathing on extension load that would prevent the extension from finding its version. Thanks to @CugeDe for finding the source of the issue.

## 1.4.0
* Added Open workspace storage directory button.
* Added Collapse All button
* Add Change Icon option in right click menu
* Removed Settings button.
* Updated Requirements Section of README
* Fixed support for VSCodium to call **codium** when changing workspace.

## 1.3.0
* Updated default icon sets to use default icons from [VSCode](https://github.com/microsoft/vscode-icons).

## 1.2.2
* Migrated repository to new home.

## 1.2.1
* Additional Docs update for version 1.2

## 1.2.0
* Added support for additional versions of VSCode.
    * VSCodium
    * VSCode OSS

Contributed by @stripedpajamas

## 1.1.0
* Added support for symlinked directories.

Workspace Explorer will now follow symlinked directories to find
.code-workspace files and image files. Thanks to @Xaryphon for providing
the initial version of the code for this feature.

## 1.0.3
* Updated .vscodeignore to not include animations.

## 1.0.2
* Updated Documentation with proper animations.

## 1.0.0
* Initial Release

## 0.0.1 to 1.0.0 Pre-release
* Beta versions

# Development Roadmap
## Proposed Features:
* Add the ability to open the Additional Custom Icon Directory from the Workspace Explorer
    * Add a button the the title bar that would open a file explorer
    at the Additional Custom Icon Directory.
* Add the ability for Workspace Explorer to search sub-folders for icons
    * Workspace Explorer would recursively search the
    **Workspace Storage Directory** for icons.
    * Workspace Explorer would recursively search the
    **Additional Custom Icons Directory** for icons.
* Add the ability to use an **ignore** file to ignore specified sub-folders
in the **Workspace Storage Directory**.
* Add a warning message to the workspace explorer if the Workspace Storage Directory is not set.
    * Waiting on the proposed API to become stable in VSCode.
    * Will remove the notification message when this is implemented.

# Contributors
* Tom Saunders (original author, primary maintainer)
* Xaryphon
* stripedpajamas
* CugeDe

# Testers
Special thanks to the project testers.
* Renaud Talon
* Robert Tomcik
* Ryan Gold
