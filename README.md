[![Lifecycle:Experimental](https://img.shields.io/badge/Lifecycle-Experimental-339999)](Redirect-URL)

# CONN-CCBC-portal

## Database Setup

Have a local instance of postges running, then do the following:

```bash
$ cd db
$ createdb ccbc
$ sqitch deploy
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

`pg_prove --username postgres --dbname ccbc db/test/*_test.sql`

## Running Jest and end to end tests locally

## Jest

In `/app` directory run `yarn test`

## End to end tests:

Cypress and Happo is used for end to end testing. A Happo account and API secret + key is required for Happo testing though it is automatically disabled if no keys exist. Happo is free for open source projects.

To run the end to end tests we need to run our development server in one terminal with the command:

`yarn dev`

Once that is running in a second terminal run:

`yarn test:e2e`
