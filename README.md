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

## Step 5: Install uv

`uv` is used to create python projects. Install instructions are here - https://docs.astral.sh/uv/getting-started/installation/

Now run `uv sync` to download and install the basic dependencies for this project

Then you can test it by running this command: `uv run main.py`

## Step 6: Install postgresql

Run this command to get the docker image: `docker pull postgres:18`

Then run the below command from within the project directory to run the server

```bash
docker run -d \
  --name tinymagiq-postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=trainingdb \
  -p 5432:5432 \
  postgres
```

Test it by running `uv run test_db.py`

## Step 7: Install Node JS

First install nvm: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`
Then reload the configuration: `source ~/.bashrc`
Finally install node 22: `nvm install 24`

Test by running these two commands: `node -v` and `npm -v`

## Step 8: Install Opencode

Run this command: `curl -fsSL https://opencode.ai/install | bash`

Test it by running `opencode` inside the project directory. Ask it to explain what `test_pg.py` file does

Then run the `/connect` command, select `Baseten` as provider, and ask me for the API Key and then select `GLM 5` as the model

## Step 9: Install VS Code Extensions

Install the following extensions for VSCode:

- WSL: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl
- Python: https://marketplace.visualstudio.com/items?itemName=ms-python.python

After that, go to the WSL terminal, and inside the project directory, run the command `code .` to launch VS Code from inside WSL

Then re-install Python extension from within WSL
