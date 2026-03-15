# Laptop Setup

## Installation Instructions

Installation instructions can be found here: https://github.com/silverstripesoftware/tinymagiq-fde

## Step 1: Install Windows Subsystem for Linux (WSL)

Go here and follow the instructions - https://learn.microsoft.com/en-us/windows/wsl/install

Install the `Ubuntu` distribution for WSL

Test by opening Ubuntu from the Start Menu and typing `ls` to see the files in the home directory

If you have not worked in Linux before, here is a very brief tutorial - https://www.geeksforgeeks.org/linux-unix/basic-linux-commands/

## Step 2: Install Visual Studio Code

Install it from here - https://code.visualstudio.com/download (Get the windows version)

## Step 3: Install Docker Desktop for Windows

Instructions - https://docs.docker.com/desktop/setup/install/windows-install/

Then after installing, enable docker for WSL2 - https://docs.docker.com/desktop/features/wsl/

## Step 4: Install git

Now go into your WSL terminal. We are going to install everything else inside WSL.

Instructions - https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

Then follow the steps here to configure SSH - https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent?platform=linux

After SSH key is created on your laptop, you need to configure Github with your public key - https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account

Test everything by cloning this repository through this command: `git clone git@github.com:silverstripesoftware/tinymagiq-fde.git`

Go inside this directory and run the command to check if python is working: `python setup/main.py`

## Step 5: Install postgresql

Follow the steps here to install postgresql from the docker image - https://postgres.guide/docs/getting-started/

Test it by creating a sample database table and running a query on it

## Step 6: Install uv

`uv` is used to create python projects. Install instructions are here - https://docs.astral.sh/uv/getting-started/installation/

Now run `uv sync` to download and install the basic dependencies for this project

Then you can test the connection to postgres database by running this command: `uv run python setup/test_pg.py`

## Step 7: Install Node JS

Install instructions

```bash
# Docker has specific installation instructions for each operating system.
# Please refer to the official documentation at https://docker.com/get-started/

# Pull the Node.js Docker image:
docker pull node:24-alpine

# Create a Node.js container and start a Shell session:
docker run -it --rm --entrypoint sh node:24-alpine

# Verify the Node.js version:
node -v # Should print "v24.14.0".

# Verify npm version:
npm -v # Should print "11.9.0".
```

## Step 8: Install Opencode

Run this command: `curl -fsSL https://opencode.ai/install | bash`

Test it by running `opencode` inside the project directory. Ask it to explain what `test_pg.py` file does

## Step 9: Install VS Code Extensions

Install the following extensions for VSCode:

- Python: https://marketplace.visualstudio.com/items?itemName=ms-python.python
- WSL: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl
