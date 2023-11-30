# Prerequisites

Have `make` installed on your computer.

# How to use?

The intention of the files in this directory is to provide an easy to run with no setup required run of all the DB unit tests on the project.

To use simply run `./run_unit_tests.sh`

Note: if on Windows please run this using WSL.

# What does it do?

The script does several things:

1. Pulls a docker image for the executable of pg_prove and creates a local file that can be used to run pg_prove without needing to install it.
2. Pulls a docker image for Sqitch, similar as 1.
3. Builds a docker image that contains Postgres 14 along with pgTAP installed.
4. Creates the ccbc test datbase
5. Deploy all test migrations
6. Runs all the db unit tests.
7. Cleans up.

The final clean up is intended to mimic the GitHub Actions step, as it ensures a fresh DB is used every time.
