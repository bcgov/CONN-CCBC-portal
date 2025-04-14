# Running Unit Tests

The intention of the files in this directory is to provide an easy to run 
with no setup required run of all the DB unit tests on the project.

## Prerequisites

Have `make` installed on your computer.

## Running the tests

### 1. Setup Environment variables
To simplify further steps, set an environment variable for the database name:

```shell
# If you have your main db running while performing tests
export TEST_DB_PORT=6432
```

### 2. Run the tests

```shell
./run_unit_tests.sh
```

#### 2.1. For Windows users
Please run this using **WSL**.

## Explanation of the script

The script does several things:

1. Pulls a docker image for the executable of pg_prove. 
2. Creates a local file that can be used to run pg_prove without needing to install it.
3. Pulls a docker image for Sqitch, similar as 1.
4. Builds a docker image that contains Postgres 14 along with pgTAP installed.
5. Creates the ccbc test datbase
6. Deploy all test migrations
7. Runs all the db unit tests.
8. Cleans up.

The final clean up is intended to mimic the GitHub Actions step, 
as it ensures a fresh DB is used every time.
