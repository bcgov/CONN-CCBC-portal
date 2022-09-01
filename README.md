[![Lifecycle:Experimental](https://img.shields.io/badge/Lifecycle-Experimental-339999)](Redirect-URL)

# CONN-CCBC-portal

## Database Setup

Have a local instance of postges running, then do the following:

```bash
make drop_db && make deploy_dev_data
```

## Environment Variables

This project uses `node-convict` to declare environment variables. Variables for each environment are declared in `development.json`, `test.json` or `production.json`.

The defaults can be overridden directly or in an .env file.

## Running the Application

Run the following commands:

```bash
$ cd app
$ yarn
$ yarn dev
```

## Running PGTap database tests locally

#### Install pg_prove:

`sudo cpan TAP::Parser::SourceHandler::pgTAP`

#### Install PGTap:

```
$ git clone https://github.com/theory/pgtap.git
$ cd pgtap
$ git checkout v1.2.0
$ git branch
$ make
$ sudo make install
$ psql -c 'CREATE EXTENSION pgtap;'
```

#### Run tests:

In the project root run:

```bash
# Run database unit tests
$ pg_prove --username postgres --dbname ccbc db/test/unit/**/*_test.sql
# Run database style tests
$ pg_prove --username postgres --dbname ccbc db/test/style/*_test.sql --set schemas_to_test=ccbc_public,ccbc_private
```

## Running Jest and end to end tests locally

## Jest

In `/app` directory run `yarn test`

## End to end tests:

Cypress and Happo is used for end to end testing. A Happo account and API secret + key is required for Happo testing though it is automatically disabled if no keys exist. Happo is free for open source projects.

To run the end to end tests we need to run our development server in one terminal with the command:

`yarn dev`

Once that is running in a second terminal run:

`yarn test:e2e`

## Object storage:

The `resolveFileUpload` middleware is set up to use AWS S3 storage. If no namespace is set and any AWS environment variables are missing the uploads will save to the local system in the `/app/uploads` folder.

#### Required environment variables to enable AWS S3 uploads:

```
OPENSHIFT_APP_NAMESPACE
AWS_S3_BUCKET
AWS_S3_REGION
AWS_S3_KEY
AWS_S3_SECRET_KEY
AWS_ROLE_ARN
```

## Release Process

Before releasing our application to our `test` and `prod` environments, an essential step is to add a tag to our sqitch plan, to identify which database changes are released to prod and should be immutable.

Additionally, to facilitate identification of the changes that are released and communication around them, we want to:

- bump the version number, following [semantic versioning](https://semver.org/)
- generate a change log, based on the commit messages using the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) format

To make this process easy, we use [`release-it`](https://github.com/release-it/release-it).

When you're ready to make a release, apply the following steps:

1. create a `chore/release` branch
1. run `make release` and follow the prompts
1. create a pull request
1. once the pull request is approved, **merge using fast-forward, from your local git repository**. Only commits that are tagged can be deployed to test and prod.

If you want to override the version number, which is automatically determined based on the conventional commit messages being relased, you can do so by passing a parameter to the `release-it` command, e.g.

```
yarn release-it 1.0.0-rc.1
```

### Sqitch migrations guardrails

As mentioned above, the critical part of the release process is to tag the sqitch plan. While tagging the sqitch plan in itself doesn't change the behaviour of our migrations scripts, it is allows us to know which changes are deployed to prod (or about to be deployed), and therefore should be considered immutable.

We developed some guardrails (i.e. GitHub actions) to:

- ensure that changes that are part of a release are immutable: [immutable-sqitch-change.yml}(.github/workflows/immutable-sqitch-change.yml)
- ensure that the sqitch plan ends with a tag on the `main` branch, preventing deployments if it is not the case. Our release command automatically sets this tag: [pre-release.yml](.github/workflows/pre-release.yml)

### Pre-Commit Hooks

_The following is to be done in the root directory_

To install the pre-commit hooks, first install the asdf tools using `make install_asdf_tools` also install the python tools using `pip install -r requirements.txt` and `pre-commit install`.

Finally, also run `make install_cocogitto_hook` for the cocogitto commit-msg hook.
