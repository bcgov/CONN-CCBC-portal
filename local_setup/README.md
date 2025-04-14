# Local Environment Setup

This folder contains two folders to run e2e and db unit_tests, please refer to the instructions 
provided inside each folder on how to use.

# Should I use Docker?

Docker gives you the flexibility of having multiple instances of postgres to run, 
for example you might want to have a fresh dev DB with dev data, a fully empty one, 
and one that has test data in it. You can reuse the command below and provide different names 
to your DBs and then run and stop them accordingly.

In simple words, **Docker is recommended**.

# Prerequisite
### For all platforms
- `make` installed on your local computer.
- `node 20` and `yarn` be installed on your computer and perform `yarn` (install dependencies) on the `app` folder.

### For Windows
- WSL and a distro (e.g. Ubuntu) of choice.

## When using Docker
Make sure `docker` is installed on your local computer.

As of April 10, 2024, the following options are recommended:
- [Podman](https://podman.io)
- [Rancher](https://ranchermanager.docs.rancher.com/getting-started/installation-and-upgrade/other-installation-methods/rancher-on-a-single-node-with-docker)
- [Portainer](https://www.portainer.io)
- [Colima](https://github.com/abiosoft/colima)

## When not using Docker
- [Postgresql 14](https://www.postgresql.org/download/)
- [Sqitch](https://sqitch.org/download/)

# Set up a local database

## 1. Setup Environment variables
To simplify further steps, set an environment variable for the database name:

```shell
# <your-db-name-here> or any name you want
export DB_NAME=ccbc
```

## 2. Bring up the database
### 2.1. Using Docker

#### 2.1.1. Start a container
```shell
export DB_CONTAINER_NAME=$DB_NAME-db

docker run -p 5432:5432 --name $DB_CONTAINER_NAME \
            -e POSTGRES_PASSWORD=mysecretpassword \
            -v .:/workspace \
            -v db-data:/var/lib/postgresql/data \
            -d postgres:14
            
docker exec -i $DB_CONTAINER_NAME psql -U postgres -c "CREATE DATABASE \"$DB_NAME\";"
```

#### 2.1.2. Run migrations
```shell
docker pull sqitch/sqitch:latest && \
    curl -L https://git.io/JJKCn -o sqitch && \
    chmod +x sqitch && \
    ./sqitch deploy -u postgres --chdir db
```

#### 2.1.3. Deploy dev data (optional)
```shell
make deploy_dev_data PSQL="docker exec -i $DB_CONTAINER_NAME psql -h localhost -U postgres"  SQITCH="sqitch -u postgres"
```

### 2.2. Without Docker (running on your machine as-is)
#### 2.2.1. Create database
In this step, it's assumed you've already created the database.
If not - please proceed with any of the ways you prefer (psql, pgAdmin, DBeaver, etc.).

#### 2.2.2 Run migrations
```shell
sqitch deploy -u postgres --chdir db
```

#### 2.2.3. Deploy dev data (optional)
```shell
make deploy_dev_data PSQL="psql -h localhost -d $DB_NAME -U postgres" SQITCH="sqitch -u postgres"
```

#### 3. Important notes
Make sure to either export the **PGPASSWORD** environment variable or 
create a **.pgpass** file on your home directory for sqitch to use.

Please refer to [Authentication in Sqitch](https://sqitch.org/docs/manual/sqitch-authentication/) for more details.

# Set up the Application

## Prerequisites
- [Node.js 20.16.0](https://nodejs.org/en/download/)
- [yarn classic](https://classic.yarnpkg.com/lang/en/docs/install)

## Environment variables

This project uses `node-convict` to declare environment variables which can be found in `/app/config/index`. 
Variables for each environment are declared in `development.json`, `test.json` or `production.json`.

The defaults can be overridden using a `.env` file placed in the `/app` directory.

## Running the application

Run the following commands:

```bash
$ cd app
$ yarn
$ yarn build:relay
$ yarn dev
```

### Relay information

This project uses react-relay and relay-nextjs.
The `yarn build:relay` command above will create the query map schema, 
create the generated directory to be used by the relay compiler to generate 
the GraphQl files, and finally build the required persistent operations.

While doing local development you might have to rerun this command 
when edition previous queries, creating new queries, adding new fragments etc.,
otherwise you might notice that query results are not being updated. 
To do so, simply stop your current development server and run `yarn build:relay && yarn dev`.

## Running tests

### Using Docker

#### Running unit tests
Please refer to [this document](unit_tests/README.md).

#### Running end-to-end tests
Please refer to [this document](e2e/README.md).

### Without Docker

#### Installing pgTAP
```shell
# pg_prove
sudo cpan TAP::Parser::SourceHandler::pgTAP

# pgTAP
git clone https://github.com/theory/pgtap.git &&\
   cd pgtap &&\
   git checkout v1.2.0 &&\
   git branch

make
make install

psql -U postgres -c 'CREATE EXTENSION pgtap;'
```

#### Running db tests:
To run the database tests run this command in the project root:

```shell
make db_unit_tests
```

Alternatively you can run single tests with `pg_prove`. 
A test database is required to run which is installed with `make db_unit_tests` or by running `make create_test_db`.

Once the test database is created you can test a single file by running:

```shell
pg_prove -d ccbc_test <path to file>
```

#### Running Jest tests

In `/app` directory run `yarn test`

#### End-to-end tests:

Cypress and Happo is used for end-to-end testing. 
A Happo account and API secret + key is required for Happo testing though it is 
automatically disabled if no keys exist. Happo is free for open source projects.

To run the end-to-end tests we need to run our development server in one terminal with the command:

```shell
yarn dev
```

Once that is running in a second terminal run:

```shell
yarn test:e2e
```

#### Happo screenshot testing
This project uses [Happo](https://happo.io/) for screenshot testing. 
Everyone who has contributor access to this repository has access to the Happo tests. 
If you require admin access needed to modify the project or testing thresholds – contact a developer 
from this project or the [CAS](https://github.com/bcgov/cas-cif) team for access.


