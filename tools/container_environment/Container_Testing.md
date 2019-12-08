# Testing VSCode Workspace Explorer in a Containerized environment

Using containers allows us to cleanly test POSIX systems on Windows.

To spin up the test envionment. Do the following:

1. Install Docker Desktop, docker-compose, and the VSCode Remote Containers extension.
2. Open a console terminal in the project directory
3. Run `docker-compose up -d`
4. Connect to the container using the Remote Containers extension. **workspace-explorer-linux-dev-env**
6. Run the Extension Debugger. Create the proper launch.json config for the debugger if needed.
5. In the newly opened **EXTENSION DEVELOPEMENT HOST**, set the container's Workspace Explorer Storage Directory to `/app/tools/container_environment/workspaces` in Settings Remote.
7. Develop
8. Spin down the environment `docker-compose down`.
