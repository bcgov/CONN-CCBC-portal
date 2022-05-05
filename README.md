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
