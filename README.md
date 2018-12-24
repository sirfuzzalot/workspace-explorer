# Introduction
Workspace Explorer provides a convenient UI to quickly switch your
workspace or open a workspace in a new window.

<a href="https://gitlab.com/jfwy2bhilv/9vsgwopwel/vscode-workspace-explorer/raw/master/resources/images/openWorkspace.gif"><img alt="https://gitlab.com/jfwy2bhilv/9vsgwopwel/vscode-workspace-explorer/raw/master/resources/images/openWorkspace_lowres.gif" src="https://gitlab.com/jfwy2bhilv/9vsgwopwel/vscode-workspace-explorer/raw/master/resources/images/openWorkspace_lowres.gif" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"></a>

# Getting Started
I should note before we dive into setup, VSCode currently allows you to **only have one instance of
a workspace open at a time**, i.e. your **node.code-workspace** can only be open
in one window of VSCode.

<a href="https://gitlab.com/jfwy2bhilv/9vsgwopwel/vscode-workspace-explorer/raw/master/resources/images/workspaceStorageDirectory.gif"><img alt="https://gitlab.com/jfwy2bhilv/9vsgwopwel/vscode-workspace-explorer/raw/master/resources/images/workspaceStorageDirectory_lowres.gif" src="https://gitlab.com/jfwy2bhilv/9vsgwopwel/vscode-workspace-explorer/raw/master/resources/images/workspaceStorageDirectory_lowres.gif" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"></a>

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

## Sub-folders
Organize your **.code-workspace** files as much as you want within the
**Workspace Explorer: Workspace Storage Directory**. Sub-folders will be listed in the Workspace Explorer. Click on the arrow
to expand the directory and reveal any deeper sub-folders or workspaces.

## Custom Icons
Workspace Explorer comes with two default icons. One for sub-folders
and one for workspaces. Adding custom icons is a great way to further
organize and quickly recognize your workspaces/sub-folders.

To add custom icons do the following:
### **OPTION ONE: Store icons in the Workspace Storage Directory and sub-folders.**

<a href="https://gitlab.com/jfwy2bhilv/9vsgwopwel/vscode-workspace-explorer/raw/master/resources/images/enableCustomIconSearch.gif"><img alt="https://gitlab.com/jfwy2bhilv/9vsgwopwel/vscode-workspace-explorer/raw/master/resources/images/enableCustomIconSearch_lowres.gif" src="https://gitlab.com/jfwy2bhilv/9vsgwopwel/vscode-workspace-explorer/raw/master/resources/images/enableCustomIconSearch_lowres.gif" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"></a>

1. Enable custom icons in the Workspace Explorer settings.
    * Check the box for the **Workspace Explorer: Enable Custom Icon Search** setting.
        * On Windows/Linux - **File > Preferences > Settings > search "Workspace Explorer"**.
        * On Mac - **Code > Preferences > Settings > search "Workspace Explorer"**.
2. Name the custom icon with the same name as the workspace or sub-folder.
**Ex: "Webserver Configs.code-workspace" ==> "Webserver Configs.svg".**
3. Add the **.svg** or **.png** files to the same location as your workspace
file or sub-folder. Curently **.svg** and **.png** are the only support
file types.
4. Hit the **refresh** icon on the Workspace Explorer.

If you don't see your icons repeat the steps above to ensure that the
images are in the exact same location as their respective **.code-workspace**
file or sub-folder AND that they are named exactly the same minus the
file extension.

### **OPTION TWO: Store icons in the Additional Custom Icon Directory**
Workspace Explorer also allows you to add an additional custom icons
directory. It first searches the **Workspace Storage Directory**. If it
then cannot find the image file (see Option One for how to name images
and where to put them) then it will search the **Additional Custom Icon Directory**.
It will only search one level of the directory (no sub-directories). If
no icon is found at that point, default icons are used.

<a href="https://gitlab.com/jfwy2bhilv/9vsgwopwel/vscode-workspace-explorer/raw/master/resources/images/additionalCustomIconDirectory.gif"><img alt="https://gitlab.com/jfwy2bhilv/9vsgwopwel/vscode-workspace-explorer/raw/master/resources/images/additionalCustomIconDirectory_lowres.gif" src="https://gitlab.com/jfwy2bhilv/9vsgwopwel/vscode-workspace-explorer/raw/master/resources/images/additionalCustomIconDirectory_lowres.gif" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"></a>

Enabling the **Additional Custom Icon Directory**
1. Ensure the **Workspace Explorer: Enable Custom Icon Search** setting
is enabled. See OPTION ONE for details.
2. Add a path to the **Workspace Explorer: Additional Custom Icon Directory**
setting.
3. Hit the **refresh** icon on the Workspace Explorer.

# Requirements
Workspace Explorer requires that **code** or **code-insiders** be added
to the **$PATH** environment variable.
* When opening a new window or switching
the workspace in the existing window it will use these key words to run
the application via command-line.

If working on **MacOS** run the Command Palette Command **Install code command in Path**

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

None

# Release Notes

## 1.0.2
* Updated Documentation with proper animations.

## 1.0.0
* Initial Release

## 0.0.1 to 1.0.0 Pre-release
* Beta versions

# Development Roadmap
## Proposed Features:
* Add the ability to save a new workspace.
    * A button would be added to the title bar indicating a new workspace.
    * Contents from the current **Explorer** section would be saved as the workspace.
    * The default location of the new workspace would be in the
    **Workspace Storage Directory**, but a **sub-folder** in the Workspace
    Explorer could be selected before clicking the button.
    * The workspace could be named and saved.
* Add the ability to create a new sub-folder.
    * A button would be added to the title bar indicating a new folder.
    * The default location of the new folder would be in the
    **Workspace Storage Directory**, but a **sub-folder** in the Workspace
    Explorer could be selected before clicking the button.
* Add the ability to add an icon to a workspace or subfolder directly in the explorer.
    * Right-click on a workspace or sub-folder to open a file dialog.
    * Support for **.svg** and **.png** files
    * File would be saved in the **Workspace Storage Directory** or sub-folder and renamed.
    **Ex: "Node Testing.code-workspace" + nodejs.svg ==> "Node Testing.svg"**.
* Add the ability to open the Workspace Storage Directory from the Workspace Explorer
    * Add a button the the title bar that would open a file explorer
    at the Workspace Storage Directory.
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
* Add Expand all and Collapse all sub-folders ability.
    * Configuration in settings to auto expand sub-folders
    * Value in settings that indicates how many levels of subfolders to search.
    * Add collapse all button to collapse the sub-folders.
    * Add expand all button to expand all sub-folders.

# Testers
Special thanks to the project testers.
* Renaud Talon
* Robert Tomcik
* Ryan Gold

# Additional Attribution
Some icons courtesy of [Material Design](http://material.io).