# CONN-CCBC-portal

## Database Setup

Have a local instance of postges running, then do the following:

```bash
$ cd db
$ createdb ccbc
$ sqitch deploy
```

## Environment Variables

This project uses `node-convict` to declare environment variables. Copy and rename `development-example.json` to `development.json`.

## Running the Application

Run the following commands:

```bash
$ cd app
$ yarn
$ yarn dev
```
