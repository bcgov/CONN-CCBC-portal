		## Hand off Documentation

## Developers Getting Started


## Ubuntu Linux 20.04 System Setup

1. Install Postgres database version 
ex:

    $sudo apt update && sudo apt upgrade
    $sudo apt -y install postgresql-14

 - verify and display the installed Postgres db version
ex:

    $psql -V

 - output similar to below 

    psql (PostgreSQL) 14.6 (Ubuntu 14.6-1.pgdg20.04+1)


2. For simplicity, the Postgres user is prohibited. 
Note: Instead your the Postgres user you must create a Postgres user of your own for all development cycles.

2.1 Create a Postgres user & role.
    Login as the Postgres user. This way you are logged in with a role of 'Super User'.
ex:
$sudo -u postgres psql
    Create <YourPostgresUser> with <YourPostgresPassword>
ex:
postgres=# CREATE USER youruser WITH ENCRYPTED PASSWORD 'yourpass';
postgres=# CREATE ROLE youruser

2.2 In Postgres, your Postgres user must have the following 5 role attributes as shown below.
- Superuser
- Create role
- Create DB
- Replication
- Bypass RLS

ex:
postgres=# ALTER USER youruser WITH Superuser, Create role, Create DB, Replication, Bypass RLS


3. Create a file in your home Linux directory '~' named '.pgpass' without the single quotes.
ex:
$cd ~
$touch .pgpass

Add the following content similar to below within file '.pgpass'.
localhost:5432:ccbc:<YourPostgresUser>:<YourPostgresPassword>


## Application specific Postgres database instructions

1. From Github, ensure you acquire the source code for project 'CONN-CCBC-portal'

2. Create the CCBC database.
$sudo createdb ccbc 

3. Create the entire database schema.
$cd ../CONN-CCBC-portal/db
$sudo sqitch deploy

4. Setup the schema and seed the CCBC database with application specific data.
$cd ../CONN-CCBC-portal/mocks_schema
$sudo sqitch deploy

-Executing database  tests
$cd ../CONN-CCBC-portal
$pg_prove --username postgres --dbname ccbc db/test/unit/**/*_test.sql

-Executing database style tests
$cd ../CONN-CCBC-portal
$pg_prove --username postgres --dbname ccbc db/test/style/*_test.sql --set schemas_to_test=ccbc_public,ccbc_private



## Instructions to follow after a GIT PULL

$cd ../CONN-CCBC-portal/db
$dropdb ccbc --force
$cd ../CONN-CCBC-portal/db
$createdb ccbc 
$sqitch deploy
$cd ../CONN-CCBC-portal/mocks_schema
$sqitch deploy


$cd ../CONN-CCBC-portal/app
$yarn install
$yarn run build:schema
$yarn run build:relay
$yarn dev



## Developer's Guide

The information below describes the entire software development stack pertaining to the CCBC portal.

1: Def'n the entire software tech stack for each software development tier.
  - Front End Tier (REACT, TypeScript, NEXT.JS, server side rendering & dynamic web pages)
    - Software Development Tools Required
        (Git source control tool)
	    (Visual Studio Code or other)
		(NodeJS, npm, npx, yarn)
      - Front End Mocking Software Tools
	  (None)
      - Front End Testing Tools
	  happo.io, Jest
  - Middleware Tier
    - Software Tools Required
        (Git source control tool)
	    (Visual Studio Code or other)
		(NodeJS, npm, npx, yarn, postgraphile, sqitch, GraphQL)
      - Middleware Mocking Software Tools
	  (None)
      - Middleware Testing
	  cypress.io, Jest
  - Database Tier
    - Software Tools Required
        (Git source control tool)
		(NodeJS, npm, npx, yarn)
		(Postgraphile GraphQL, sqitch )
		(PostgresDb 14)
      - Database Mocking Software Tools
	    (in-house db mocks of intake date ranges)
      - Database Testing

2: Developer's Software Development Environment and Software Tools Required
   - Operating System (Ubuntu 20 Linux)
   - Source Code tools, (Git source control tool, GitFlow Workflow) 
   - SQL Source Editor
     (Visual Studio Code  or other)
   - Middleware Tools (Postman, Insomnia, Testfully)
        (Git source control tool)
		(NodeJS, npm, npx, yarn)
		(postgraphile, sqitch, GraphQL)
   - Database 
		(PostgresDb 14)

3: Def'n developer workflow & constraints 
   - Define Commit requirements and procedures 
     - ex: commit messages must have prefixed text based on conventional commits.
           ex=> fix: feat: chore: docs:
           https://www.conventionalcommits.org/en/v1.0.0-beta.2/
   - Automation Tools
      - Sonar Qube scanner
	    - verifies conformity of source in Pull Request
   - Pull Request requirements and procedures
      - minimum 1 reviewer approval required



4: Def'n the software tier relevance, significance and function of file system in source branch root.

## CONN-CCBC-portal/
drwxrwxr-x   2 user user          4096 Dec  6 17:19                .bin/                                   - bash shell scripts -> cron setup, pre-commit rules + sqitch scripts
drwxrwxr-x   8 user user        4096 Jan  9 16:37                  .git/                                     - git source control configuration
drwxrwxr-x   5 user user        4096 Nov 24 00:17                 .github/                               - github control configuration
drwxrwxr-x   2 user user        4096 Nov 24 00:17                 .zap/                                   - Zed Attack Proxy ZAP, an OWASP penetration testing web app tool
drwxrwxr-x 20 user user        4096 Jan  9 16:37                   app/                                    - NEXT.JS client code
drwxrwxr-x   3 user user        4096 Dec  6 17:19                  Infrastructure/                      - AWS S3Buckets & ClamAv antivirus Terraform IAC scripts 
drwxrwxr-x   6 user user        4096 Jan  9 16:37                  db/                                      - POSTGRES database source code
drwxrwxr-x   3 user user        4096 Nov 24 00:17                 docs/                                   - general documentation on project CONN-CCBC-portal
drwxrwxr-x   4 user user        4096 Nov 24 00:17                 helm/                                  - helper to manage Kubernetes applications
drwxrwxr-x   2 user user        4096 Nov 24 00:17                 lib/                                      - TypeScript & Node.js specific helpers (relay)
drwxrwxr-x   5 user user        4096 Nov 29 21:16                 mocks_schema/                     - POSTGRES database schema mocks (db data seeding)
drwxrwxr-x 410 user user       16384 Nov 25 15:47               node_modules/                      - NEXT.JS client libraries dependencies in ./app/package.json

-rw-rw-r--    1 user user          54 Nov 24 00:17                   .dockerignore                        - docker configuration file
-rw-rw-r--    1 user user         131 Dec  2 00:43                   .gitignore                              - git configuration file 
-rw-rw-r--    1 user user        16796 Nov 24 00:17                .gitleaks.toml                        - Cron job monitoring
-rw-rw-r--    1 user user         111 Nov 24 00:17                  .gitmodules                           - git cas-postgres-style-tests
-rw-rw-r--    1 user user         893 Nov 24 00:17                  .pre-commit-config.yaml         - describes repositories and hooks are installed
-rw-rw-r--    1 user user          58 Nov 24 00:17                   .prettierignore                       - see below, ignore env & yaml files
-rw-rw-r--    1 user user         111 Nov 24 00:17                  .prettierrc                              - code formatter for JSX, YAML, TypeScript
-rw-rw-r--    1 user user          83 Nov 24 00:17                   .tool-versions                        - part of asdf version control manager

-rw-rw-r--   1 user user         834 Jan  9 16:37                      package.json                        - master file for npm/yarn package managers
-rw-rw-r--   1 user user          19 Nov 24 00:17                     requirements.txt                    - pre-commit==1.18.3
-rw-rw-r--   1 user user         646 Dec  6 21:47                     sonar-project.properties         - sonar scanner configurator
-rw-rw-r--    1 user user        164798 Jan  9 16:37                 CHANGELOG.md                   - self describing
-rw-rw-r--    1 user user         260 Nov 24 00:17                    COMPLIANCE.yaml                - project tracking
-rw-rw-r--    1 user user       11357 Nov 24 00:17                   LICENSE                             - self describing
-rw-rw-r--    1 user user        9741 Dec  2 00:43                    Makefile                              - bash shell script - environment setup using asdf
-rw-rw-r--    1 user user        4376 Dec 19 16:26                   README.md                         - self describing
-rw-rw-r--    1 user user          28 Nov 24 00:17                     cog.toml                             - changelog & versionning
-rw-rw-r--    1 user user         126 Nov 24 00:17                    cpanfile                              - Perl dependencies descriptions
-rw-rw-r--    1 user user        1048576 Nov 28 16:53              dummy_data_1M.kmz           - google earth (Keyhole Markup Zip)
                                           
          

## CONN-CCBC-portal/app
drwxrwxr-x             5 user user             4096 Jan  4 16:32            .next/                         - configurations for client-side NEXT.JS
drwxrwxr-x             3 user user             4096 Nov 24 00:17          backend/                     - NodeJS code utils for db & middleware, AWS S3
drwxrwxr-x             7 user user             4096 Dec  6 17:19           components/               - NEXT.JS/REACT client-side UI components
drwxrwxr-x             2 user user             4096 Jan  4 15:59            config/                       - various environment variables & constants for runtime
drwxrwxr-x             6 user user             4096 Nov 24 00:17           cypress/                     - JavaScript-based end-to-end testing framework 
drwxrwxr-x             3 user user             4096 Jan  6 18:06             data/                         - UI constants, utils & CSS styles
drwxrwxr-x             5 user user             4096 Jan  6 18:06             formSchema/             - HTML attributes in JSON format for analyst pages
drwxrwxr-x             4 user user             4096 Nov 24 00:17            lib/                          - middleware requests, utils, routing & REACT UI components
drwxrwxr-x             4 user user             4096 Nov 24 00:17           pages/                      -  NEXT.JS server side rendering for client-side dynamic HTML pages
drwxrwxr-x             2 user user             4096 Dec 19 16:26           patches/                    - special case 3rd party software patch
drwxrwxr-x             3 user user             4096 Nov 24 00:17           public/                      - static assets, images & icons 
drwxrwxr-x             3 user user             4096 Jan  6 18:06           schema/                      - GraphQL mutations & schema
drwxrwxr-x             2 user user             4096 Jan  6 18:06           styles/                        - client-side HTML styling
drwxrwxr-x            10 user user             4096 Nov 24 00:17          tests/                        - various JEST tests
drwxrwxr-x             2 user user             4096 Nov 24 00:17           uploads/                   - AWS S3 Bucket uploads
drwxrwxr-x             2 user user             4096 Dec 19 16:26           utils/                         - various NodeJS utilities
drwxrwxr-x             2 user user             4096 Jan  4 16:31            __generated__/          - generated during yarn build:relay
drwxrwxr-x           883 user user            36864 Jan  9 16:51           node_modules/         - NEXT.JS client libraries dependencies in ./app/package.json

-rw-rw-r--             1 user user              282 Nov 24 00:17           .babelrc                       - REACT dependency
-rw-rw-r--             1 user user              683 Nov 24 19:30           .env                            - environment variables for NodeJS
-rw-rw-r--             1 user user              572 Nov 24 00:17           .env.example                - sample file unused
-rw-rw-r--             1 user user                5 Nov 24 00:17            .eslintignore                  - JavaScript linter
-rw-rw-r--             1 user user             1761 Nov 24 00:17          .eslintrc.js                    - JavaScript linter 
-rw-rw-r--             1 user user              471 Nov 24 00:17           .gitignore                     - git configuration
-rw-rw-r--             1 user user              761 Nov 24 00:17           .happo.js                     - HTML screen snapshot testing
-rw-rw-r--             1 user user              640 Nov 24 00:17           .postgraphilerc.js          - PostGraphile GraphQL configuration
-rw-rw-r--             1 user user             2919 Nov 24 00:17           Dockerfile                   - docker container config file
-rw-rw-r--             1 user user             1582 Nov 24 00:17           README.md                 - self describing
-rw-rw-r--             1 user user              146 Nov 24 00:17            cypress.json                - JavaScript end-to-end testing config 
-rw-rw-r--             1 user user              359 Nov 24 00:17           babel.config.json           - REACT config settings
-rw-rw-r--             1 user user             6714 Nov 24 00:17           jest.config.ts                - JEST JavaScript testing framework 
-rw-rw-r--             1 user user              132 Nov 24 00:17           nodemon.json               - local machine discreet web server
-rw-rw-r--             1 user user             4874 Jan  9 16:37            package.json                - master file for npm/yarn package managers
-rw-rw-r--             1 user user              732 Nov 24 00:17           postgraphile.tags.json5  - Tags interpreted by PostGraphile GraphQL
-rw-rw-r--             1 user user              616 Nov 24 00:17           sentry.client.config.js     - NEXT.JS config settings
-rw-rw-r--             1 user user               78 Nov 24 00:17           sentry.properties            - NEXT.JS config settings
-rw-rw-r--             1 user user              627 Nov 24 00:17          sentry.server.config.js     - NEXT.JS config settings
-rw-rw-r--             1 user user             2270 Dec 19 16:26          server.ts                       - NodeJS middleware services
-rw-rw-r--             1 user user              124 Nov 24 00:17          types.d.ts                     - JavaScript types for TypeScript 
-rw-rw-r--             1 user user              201 Nov 24 00:17          next-env.d.ts                - NEXT.JS O/S environment config settings
-rw-rw-r--             1 user user             1588 Nov 24 00:17         next.config.js                - NEXT.JS config settings
-rw-rw-r--             1 user user              617 Nov 24 00:17          tsconfig.json                 - TypeScript config settings
-rw-rw-r--             1 user user              260 Nov 24 00:17          tsconfig.server.json        - TypeScript config settings
-rw-rw-r--             1 user user              489121 Jan  9 16:37      yarn.lock                       - created by yarn when executing yarn install 


5: Def'n the CI/CD deployment 7 testing process, procedures and execution scenarios to:
   
- bash shell script that deploys app tools
#!/bin/bash
set -euxo pipefail
echo "Deploying application tools to openshift $*"
cd helm/tools
helm dep up
helm upgrade --install --atomic -f ./values.yaml "$@" ccbc-tools .


- bash shell script that deploys app
#!/bin/bash
set -euxo pipefail
echo "Deploying application to openshift $*"
cd helm/app
helm dep up
helm upgrade --install --atomic -f ./values.yaml "$@" ccbc . --timeout=20m0s

## DevOps Console
https://console.apps.silver.devops.gov.bc.ca

## OpenShift 4 Platform OAuth Silver Cluster - use github OIDC

https://console.apps.silver.devops.gov.bc.ca/
https://console.apps.silver.devops.gov.bc.ca/command line tools
https://console.apps.silver.devops.gov.bc.ca/k8s/cluster/projects

## OpenShift 4 Platform Administrator & Developer

## Projects/Clusters

ff61fb-dev
ff61fb-prod
ff61fb-test
ff61fb-tools

b40eb8-dev
b40eb8-prod
b40eb8-test
b40eb8-tools

bc5936-dev
bc5936-prod
bc5936-test
bc5936-tools


6: Define runtime

To reset the intake date on page
http://localhost:3000/applicantportal/dashboard#
to the desired date/time.

## Runtime URLs

# User Type: Analyst
http://localhost:3000/analyst

# User Type: Applicant
http://localhost:3000/applicantportal

# IDIR
https://dev.connectingcommunitiesbc.ca/analyst


## Environment variables

# Variables for each environment:

development.json
test.json
production.json


# Global environment variable names:
OPENSHIFT_APP_NAMESPACE
AWS_S3_BUCKET
AWS_S3_REGION
AWS_S3_KEY
AWS_S3_SECRET_KEY
AWS_ROLE_ARN
 