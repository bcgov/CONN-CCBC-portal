[![Lifecycle:Experimental](https://img.shields.io/badge/Lifecycle-Experimental-339999)](Redirect-URL)

# CONN-CCBC-portal

## Table of contents

- [Contributing](docs/CONTRIBUTING.md)
- [Authentication and authorization](docs/auth.md)
- [Release process](#release-process)
- [AWS Infrastructure](docs/AWS_Infrastructure.md)
- [Database Development](docs/Database_Development.md)
- [SchemaSpy Database documentation](https://bcgov.github.io/CONN-CCBC-portal/schemaspy/)

#### Local development

- [Setting up a local development environment](#setting-up-a-local-development-environment)
- [Running PGTap database tests locally](#running-pgtap-database-tests-locally)
- [Running Jest and end to end tests locally](#running-jest-and-end-to-end-tests-locally)
- [Pre-commit hooks](#pre-commit-hooks)

##### Database best practices and disaster recovery

- [Modifying the database](db/README.md)
- [Database style rules](db/test/style/README.md)
- [Process to manipulate data in production](docs/process_to_manipulate_data.md)
- [Database backup with pg_dump](docs/Data_Dump_With_Pg_Dump)

##### Infrastructure

- [Object storage](#object-storage)
- [CCBC AWS Infrustructure automated setup](Infrastructure/README.md)

## Setting up a local development environment

#### Database setup

Required dependencies:

- [Postgresql 14](https://www.postgresql.org/download/)
- [Sqitch](https://sqitch.org/download/)

Have a local instance of postgres running and ensure sqitch can [authenticate](https://sqitch.org/docs/manual/sqitch-authentication/) with postgres. The simplest way to do this is with a [.pgpass](https://www.postgresql.org/docs/current/libpq-pgpass.html) file in your home directory containing the hostname, port, database name, username and password:

`127.0.0.1:5432:postgres:username:password`

Once Postgres 14 and Sqitch are setup run the following in the root directory:

```bash
make drop_db && make deploy_dev_data
```

Alternatively you can create the database using `createdb ccbc` and then running `sqitch deploy` in the `/db` directory.

#### Environment variables

This project uses `node-convict` to declare environment variables which can be found in `/app/config/index`. Variables for each environment are declared in `development.json`, `test.json` or `production.json`.

The defaults can be overridden using a `.env` file placed in the `/app` directory.

#### Running the application

Required dependencies:

- [Node.js 16.17.0](https://nodejs.org/en/download/)
- [yarn classic](https://classic.yarnpkg.com/lang/en/docs/install)

Run the following commands:

```bash
$ cd app
$ yarn
$ yarn build:relay
$ yarn dev
```

### Running PGTap database tests locally

##### Install pg_prove:

`sudo cpan TAP::Parser::SourceHandler::pgTAP`

##### Install PGTap:

```
$ git clone https://github.com/theory/pgtap.git
$ cd pgtap
$ git checkout v1.2.0
$ git branch
$ make
$ sudo make install
$ psql -c 'CREATE EXTENSION pgtap;'
```

##### Run tests:

To run the database tests run this command in the project root:

`make db_unit_tests`

Alternatively you can run single tests with `pg_prove`. A test database is required to run which is installed with `make db_unit_tests` or by running `make create_test_db`.

Once the test database is created you can test a single file by running:

`pg_prove -d ccbc_test <path to file>`

### Running Jest and end to end tests locally

#### Jest

In `/app` directory run `yarn test`

#### End to end tests:

Cypress and Happo is used for end to end testing. A Happo account and API secret + key is required for Happo testing though it is automatically disabled if no keys exist. Happo is free for open source projects.

To run the end to end tests we need to run our development server in one terminal with the command:

`yarn dev`

Once that is running in a second terminal run:

`yarn test:e2e`

### Happo screenshot testing

This project uses [Happo](https://happo.io/) for screenshot testing. Everyone who has contributor access to this repository has access to the Happo tests. If you require admin access needed to modify the project or testing thresholds contact a developer from this project or the [CAS](https://github.com/bcgov/cas-cif) team for access.

### Object storage:

The `resolveFileUpload` middleware is set up to use AWS S3 storage. If no namespace is set and any AWS environment variables are missing the uploads will save to the local system in the `/app/uploads` folder.

##### Required environment variables to enable AWS S3 uploads:

```
OPENSHIFT_APP_NAMESPACE
AWS_S3_BUCKET
AWS_S3_REGION
AWS_S3_KEY
AWS_S3_SECRET_KEY
AWS_ROLE_ARN
```

### Release Process

Before releasing our application to our `test` and `prod` environments, an essential step is to add a tag to our sqitch plan, to identify which database changes are released to prod and should be immutable.

Additionally, to facilitate identification of the changes that are released and communication around them, we want to:

- bump the version number, following [semantic versioning](https://semver.org/)
- generate a change log, based on the commit messages using the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) format

To make this process easy, we use [`release-it`](https://github.com/release-it/release-it).

When you're ready to make a release, apply the following steps:

1. create a `chore/release` branch
1. set the upstream with `git push -u origin chore/release`
1. run `make release` and follow the prompts
1. create a pull request
1. once the pull request is approved, merge using merge button on GitHub UI. Only commits that are tagged can be deployed to test and prod.

If you want to override the version number, which is automatically determined based on the conventional commit messages being relased, you can do so by passing a parameter to the `release-it` command, e.g.

```
yarn release-it 1.0.0-rc.1
```

#### Sqitch migrations guardrails

As mentioned above, the critical part of the release process is to tag the sqitch plan. While tagging the sqitch plan in itself doesn't change the behaviour of our migrations scripts, it is allows us to know which changes are deployed to prod (or about to be deployed), and therefore should be considered immutable.

We developed some guardrails (i.e. GitHub actions) to:

- ensure that changes that are part of a release are immutable: [immutable-sqitch-change.yml](.github/workflows/immutable-sqitch-change.yml)
- ensure that the sqitch plan ends with a tag on the `main` branch, preventing deployments if it is not the case. Our release command automatically sets this tag: [pre-release.yml](.github/workflows/pre-release.yml)

#### Pre-Commit Hooks

Required dependencies:

- [Cargo (Rust package manager)](https://www.rust-lang.org/tools/install)
- [pre-commit](https://pre-commit.com/)

_The following is to be done in the root directory_

Hooks are installed with when running `make install_git_hooks`, installing both the python pre-commit hooks as well as a commit-msg hook by cocogitto
