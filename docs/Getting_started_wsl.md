## Steps to Get Started in WSL Using Image Ubuntu 22.04.2

These steps are not for completely setting up all dev steps. For that, checkout the main [README](/README.md#setting-up-a-local-development-environment) for specific steps in setting up the environment once all tools are installed from this guide.

A very important note: WSL will experience significant performance degradation if the clone of the repository is outside of the WSL environment. So make sure to clone the repo within WSL (i.e., anywhere outside of the /mnt directory).

1. Install [asdf](https://asdf-vm.com/guide/getting-started.html) (and all related asdf plugins for this project).

2. Install all the necessary tools using either `make install_asdf_tools` or `asdf install`. Some of these are repeated in `make install_dev_tools`.

   - Install `build-essential` for C compiler (or choose your preferred C compiler) and `libedit-dev` for Python installation.
   - You will likely need `readline`. Install `libreadline-dev`.
   - You will likely need `zlib`. Install `zlib1g-dev`.
   - You will likely need `crypto`. Install `libssl-dev`.
   - You will likely need `uuid`. Install `uuid-dev`.
   - You will likely need `xml2`. Install `libxml2-dev`.
   - When installing Python, you will likely need `tk`. Install `tk-dev`.
   - When compiling Python for the pre-commit hook, you will need `sqlite3`. Install `libsqlite3-dev`.
   - To install all of them together using `apt`, run: `sudo apt install build-essential libedit-dev zlib1g-dev libssl-dev uuid-dev libxml2-dev tk-dev libsqlite3-dev libreadline-dev`.

3. Install node modules in the root directory using `yarn`.

4. Install node modules in the `/app` directory using `yarn`.

5. Back in the root folder, you will likely have to create your own PostgreSQL user to connect to the database using your default credentials. To do this, log in using the `postgres` user with the command: `psql -U postgres -d postgres`. Then, create a user with the same name as the user you are signed in as on your account using: `create user <username> with superuser;`.

6. If you are using `make`, use `make install_dev_tools` to download [Sqitch](https://sqitch.org/download/) and other database tools, as well as install requirements for pre-commit. If there are failures here, sourcing `~/.bashrc` should help resolve this. Otherwise, if you're not using `make`, manually install [pgtap](https://pgtap.org/documentation.html#installation) and [Sqitch](https://sqitch.org/download/).

   - The `install_perl_tools` step may fail or give off a warning such as `Can't write to /usr/local/share/perl/5.34.0 and /usr/local/bin`. Following that, it will provide a command to solve that issue (`cpanm --local-lib...`). If Sqitch fails to install, this command is likely to fix it.

7. Install Git hooks for running Prettier and other pre-commit hooks by using `make install_git_hooks` or running `pre-commit install`.

8. Using Sqitch, you can deploy all database changes by changing the directory to `/db` and running the command `sqitch deploy` (after creating the database `ccbc`). Alternatively, you can run `make deploy_dev_data` to deploy all changes and seed the database with some data.
