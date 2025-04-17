# Database Development

Project uses PostgreSQL database, a free and open-source relational database management system emphasizing extensibility and SQL compliance, and uses Sqitch as a database change management application.

Project adopts Backend for Frontend (BFF) architecture, and uses [GraphQL API](http://graphql.org/learn/) and [Relay](https://facebook.github.io/relay/), which is a framework that connects React apps with GraphQL APIs. 


### Purpose

The purpose of this document is to provide high-level description of the database used in the solution and the processes and procedures related to implementation of new features and database-related tasks.

## Initial setup

Please see section [Database Setup](../README.md#database-setup). 

Assuming that both PostgreSQL and Sqitch are installed, and all necessary permissions are configured, next set of bash commands (executed in the project root folder) will result in database to be created, updated with latest schema and functions, and is ready for the application:

```
dropdb ccbc
createdb ccbc
cd db 
psql -d ccbc -c 'CREATE EXTENSION pgtap;'

sqitch deploy
cd ..
cd mocks_schema
sqitch deploy
cd ..
```

## Making changes 

Sqitch manages changes and dependencies via a plan file (`db\sqitch.plan`), employing a Merkle tree pattern similar to Git and Blockchain to ensure deployment integrity. The file is tracked in GitHub and it should not be chamged manually.

When a new database object (table, mutation, role etc.) need to be added, please run next command (see more at [Sqitch changes](../db/README.md#sqitch-changes))

```
sqitch add <object_type>/<object_name> --without verify  -m "<some message>"
```

Sqitch will generate necessary file placeholders in `deploy`,`revert` folders, and add references to new files into `sqitch.plan`. Now we can fill in the blanks and implement necessary SQL scripts that create new table, function or grant necessary permissions and access etc.

When there is a need to update existing database object, special Sqitch command [revert](https://sqitch.org/docs/manual/sqitch-revert/) should be used:

```
sqitch rework <object_type>/<object_name>  -m "<some message>"
```

Sqitch will save existing scripts in `deploy` and `revert` folders with new name which includes latest release label (i.e. `deploy\tables\existing_table_name@1.0.0.sql`), and add necessary entries into `sqitch.plan`.
Now developer can make any changes to the `deploy\tables\existing_table_name.sql` without triggering errors from sqitch-immutable-files.sh pre-commit hook.

As a part of release process, we add a tag to the sqitch plan, to identify which database changes are released to prod and should be immutable. Please see [Release process](../README.md#release-process) section of the README.



## Building GraphQL schema

After all changes to the database are implemented, GrapghQL schema need to be re-generated. 
To be able to use Relay. the GraphQL schema need to be Relay-compliant. 

To regenerate schema and Replay files (folder `app\__generated__`), next commands should be executed:

```
cd app
yarn run build:schema
yarn run build:relay
```

Now Frontend code can address objects defined in `app\schema\schema.graphql`.

## Database schema

Latest database schema is generated automatically on every check-in or merge into `main` branch, and published to GitHub page: 
[SchemaSpy Database documentation](https://bcgov.github.io/CONN-CCBC-portal/schemaspy/).

