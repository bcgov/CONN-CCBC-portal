[![Lifecycle:Experimental](https://img.shields.io/badge/Lifecycle-Experimental-339999)](Redirect-URL)

# CONN-CCBC-portal

## Table of contents

- [Contributing](docs/CONTRIBUTING.md)
- [Authentication and authorization](docs/auth.md)
- [Release process](#release-process)
- [AWS Infrastructure](docs/AWS_Infrastructure.md)
- [Database Development](docs/Database_Development.md)
- [CI/CD Pipeline](docs/CI_CD/.md)
- [SchemaSpy Database documentation](https://bcgov.github.io/CONN-CCBC-portal/schemaspy/)
- [Growthbook](#growthbook)
- [Metabase](#metabase)
- [Intake Updates Guide](docs/Necessary_changes_For_Intake_Update.md)

#### Local development

- [Setting up a local development environment](#setting-up-a-local-development-environment)
- [Setting up a local development environment in wsl](docs/Getting_started_wsl.md)
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

##### OpenShift information

- [General Information](#general-information)
- [Deploying the project](#deploying-the-project)
- [Disaster recovery information](#disaster-recovery-documentation)
- [CronJobs](#cronjobs)
- [Certificates](#certificates)

## Setting up a local development environment
#### Database setup
#### Environment variables
#### Running the application

Please refer to [this document](local_setup/README.md).

### Running PGTap database tests locally

##### Install pg_prove:

`sudo cpan TAP::Parser::SourceHandler::pgTAP`

##### Install PGTap:

```
git clone https://github.com/theory/pgtap.git &&\
   cd pgtap &&\
   git checkout v1.2.0 &&\
   git branch

make
make install

psql -U postgres -c 'CREATE EXTENSION pgtap;'
```

##### Run tests:

To run the database tests run this command in the project root:

`make db_unit_tests`

Alternatively you can run single tests with `pg_prove`. A test database is required to run which is installed with `make db_unit_tests` or by running `make create_test_db`.

Once the test database is created you can test a single file by running:

`pg_prove -d ccbc_test <path to file>`

### Running Jest and end-to-end tests locally

#### Jest

In `/app` directory run `yarn test`

#### End-to-end tests:

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

To enable logging in the development console set the `ENABLE_AWS_LOGS` environment variable to `true`.

### Release Process

Before releasing our application to our `test` and `prod` environments, an essential step is to add a tag to our sqitch plan, to identify which database changes are released to prod and should be immutable.

Additionally, to facilitate identification of the changes that are released and communication around them, we want to:

- bump the version number, following [semantic versioning](https://semver.org/)
- generate a change log, based on the commit messages using the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) format

To make this process easy, we use [`release-it`](https://github.com/release-it/release-it).

#### Automatic release

The process above has been automated and is automatically performed by the ccbc-service-account on each merge to main. To start a release using the process:

1. Find the PR named "chore:release" created by the ccbc-service-account
1. Approve the PR and merge it
1. Monitor the Action run, it will automatically deploy to dev, followed by test.
1. If a prod deployment is needed, approve the release once required.

#### Manual process

If a manual release is needed, perform the following steps:

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

## OpenShift information

### General information

- [The Private Cloud as a Service Platform Technical Documentation](https://docs.developer.gov.bc.ca/)

### Deploying the project

#### Prerequisite

Before you can automate the deployment you will to manually deploy using helm so that the deployer account gets created, refer to the [deployment script](https://github.com/bcgov/CONN-CCBC-portal/blob/main/lib/app_deploy.sh) for the command and to the [app actions](https://github.com/bcgov/CONN-CCBC-portal/blob/main/.github/actions/app/action.yaml) for the environment overrides

#### Deploying

To deploy the project into a a new namespace or to deploy another instance of the project into an existing namespace GitHub Environments along with Helm and GitHub Actions is used. The following steps can be used to as a reference to deploy:

1. Create a new environment on the GitHub repository, set any protection rules as necessary. The environment will be used to hold the secrets needed for GitHub Actions to be passed to Helm.
2. Add the following secrets and fill as appropriate:

   - AWS_CLAM_S3_BUCKET
   - AWS_ROLE_ARN
   - AWS_S3_BACKUPS_BUCKET
   - AWS_S3_BUCKET
   - AWS_S3_KEY
   - AWS_S3_REGION
   - AWS_S3_SECRET_KEY
   - CLIENT_SECRET
     - SSO Client Secret
   - NEXT_PUBLIC_GROWTHBOOK_API_KEY
   - OPENSHIFT_APP_NAMESPACE
   - OPENSHIFT_METABASE_NAMESPACE
     - Used for NetworkPolicy
   - OPENSHIFT_METABASE_PROD_NAMESPACE
     - Used for NetworkPolicy
   - OPENSHIFT_ROUTE
   - OPENSHIFT_SECURE_ROUTE
   - OPENSHIFT_TOKEN
   - CERT
   - CERT_KEY
   - CERT_CA

3. Create any updated values as needed for your new deployment under `helm/app`. For example, if you named your environment `foo` you will create a file named `values-foo.yaml`
4. Add an extra step to `.github/workflows/deploy.yaml` with updated job and environment name.
5. Run the action!

Note: there might be additional modifications or steps required to suit your specific needs, You might need to create independent workflows or Helm charts.

### Disaster recovery documentation

Please refer to [CCBC Disaster Recovery Testing with Patroni](https://github.com/bcgov/CONN-CCBC-portal/blob/main/docs/Disaster_recovery_Patroni.md)

In case of a major disaster in which the database volume has been lost refer to [Restoring Backup volumes on OpenShift](https://docs.developer.gov.bc.ca/netapp-backup-restore/)

### Cronjobs

The project consists of several OpenShift [CronJobs](https://docs.openshift.com/container-platform/4.12/rest_api/workloads_apis/cronjob-batch-v1.html) to automatically run the following tasks:

#### Incremental backup

Managed by the PostgresCluster Operator (CrunchyDB), performs an incremental database backup at every 4 hours, starting at 1:00AM Pacific Time.

#### Full backup

As above managed by CrunchyDB. Performs a full backup of the database everyday at 1:00AM Pacific Time.

#### Receive applications

Marks all applications for a specific intake as received on the database. Runs twice a day at 10:00 AM and 10:00PM Pacific time.

Sets any applications with status of `submitted` to `received`.

#### Prepare download

Prepares attachments for download from the S3 bucket. Runs twice a day at 10:00 AM and 10:00PM Pacific time.

#### Running a CronJob manually

To run any of the CronJobs above manually:

1. Get the name of CronJob you want to run by running: `oc get CronJob`
2. To start the CronJob run: `oc create job --from cronjob/[NAME FROM STEP 1] [YOUR JOB NAME]`. For example assuming the name of the CronJob from step 1 is `ccbc-pgbackrest-repo1-full` and we want to name our job my-manual-job then we will run `oc create job --from cronjob/ccbc-pgbackrest-repo1-full my-manual-job`.
3. Once ran you should see `job.batch/[YOUR JOB NAME]` created

Note that you cannot run a job with the same name twice, if you need to rerun a job either delete the old job and re run the command from step 2, or use a different name.

### Certificates

Certificates are generated using the standard BC Government process:

Certificates are generated using the standard BC Government process:

1. Create a submission for certificates through MySC.
2. Generate a CSR or use one already generated and provide it when requested. If a new one is needed, you can use the following command:
   `openssl req -new -newkey rsa:2048 -nodes -out domain.ca.csr -keyout domain.ca.key -subj "/C=CA/ST=British Columbia/L=Victoria/O=Government of the Province of British Columbia/OU=NetworkBC/CN=domain.ca"` replace `domain.ca` with the domain you are generating a certificate for.

3. The step above will give you two files, `domain.ca.csr` and `domain.ca.key`. You will _only_ need to share the CSR; the key will be saved in a secret as listed above during deployment.
4. Once complete, you will receive a certificate and a chain. Use them in the `CERT` and `CERT_CA` fields, respectively. You might also need to update `CERT_KEY` if a new CSR was used.
5. Repeat this process for any other certificates you need to renew (e.g., dev, test, etc.).
6. Finally, to update the certificates run the deploy action for each environment that needs updating.

## Growthbook

GrowthBook is an open-source platform for feature flagging and A/B testing. In the context of our application, we use it as follows:

- **Feature Flagging:** Enables or disables functionality per environment (dev, test, and prod).
- **Banners:** GrowthBook allows setting values on features to be outside of true and false. This allows us to create "objects" and read them in the app to set custom banners.

### Adding a Feature

For detailed instructions on how to add and manage features, please refer to the [GrowthBook docs](https://docs.growthbook.io/features/basics).

### Getting Access

To get access to GrowthBook for this project, contact one of the administrators. You will then be able to create and manage feature flags.

## Metabase

Metabase is an open source business intelligence tool that lets you create charts and dashboards using data from a variety of databases and data sources. In the context of our application we use it to generate a variety of visualizations based on the data on the portal as well as other data consumed into our database.

### Deployment

Our Metabase is deployed using Helm, it consists of a Docker image as well as a CrunchyDB (Postgres). The Metabase repo can be found [here.](https://github.com/bcgov/conn-metabase)

### More information

For more information on Metabase, [visit the official docs.](https://www.metabase.com/docs/latest/)

For information on queries/questions, [refer to this documentation.](https://www.metabase.com/learn/questions/searching-tables)
