# How to use?

This folder contains two folders to run e2e and db unit_tests, please refer to the instructions provided inside each folder on how to use.

# Prerequisite

Please have the following:

- WSL and a distro (e.g. Ubuntu) of choice if you are on Windows.
- `docker` installed on your local computer and enabled on WSL if you are on Windows.
- `make` installed on your local computer.
- `node 18` and `yarn` be installed on your computer and perform `yarn` (install dependencies) on the `app` folder.

# Local Dev DB

If you just want to deploy a local dev database without having to install and run one locally you can use:

`docker run -p 5432:5432 --name <your-db-name-here> -e POSTGRES_PASSWORD=mysecretpassword -d postgres:14`

Once you have started the DB you can deploy your migrations by using:

`sqitch deploy -u postgres` or without installing it:

```
docker pull sqitch/sqitch:latest &&
curl -L https://git.io/JJKCn -o sqitch && chmod +x sqitch &&
./sqitch deploy -u postgres
```

Make sure to either export the PGPASSWORD environment variable or create a .pgpass file on your home directory for sqitch to use.

# Why run using Docker?

This gives you the flexibility of having multiple instances of postgres to run, for example you might want to have a fresh dev DB with dev data, a fully empty one, and one that has test data in it. You can reuse the command above and provide different names to your DBs and then run and stop them accordingly.
