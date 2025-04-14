# OpenShift Information

### General information
- [The Private Cloud as a Service Platform Technical Documentation](https://docs.developer.gov.bc.ca/)

### Deploying the project

#### Prerequisite

Before you can automate the deployment you will to manually deploy using helm so that the deployer account gets created, 
refer to the [deployment script](https://github.com/bcgov/CONN-CCBC-portal/blob/main/lib/app_deploy.sh) 
for the command and 
to the [app actions](https://github.com/bcgov/CONN-CCBC-portal/blob/main/.github/actions/app/action.yaml) for the environment overrides.

#### Deploying

To deploy the project into a new namespace or to deploy another instance of the project 
into an existing namespace GitHub Environments along with Helm and GitHub Actions is used. 
The following steps can be used to as a reference to deploy:

1. Create a new environment on the GitHub repository, set any protection rules as necessary. 
   The environment will be used to hold the secrets needed for GitHub Actions to be passed to Helm.
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

3. Create any updated values as needed for your new deployment under `helm/app`. 
   For example, if you named your environment `foo` you will create a file named `values-foo.yaml`
4. Add an extra step to `.github/workflows/deploy.yaml` with updated job and environment name.
5. Run the action!

**Note**: there might be additional modifications or steps required to suit your specific needs. 
You might need to create independent workflows or Helm charts.

### Disaster recovery documentation

Please refer to [CCBC Disaster Recovery Testing with Patroni](https://github.com/bcgov/CONN-CCBC-portal/blob/main/docs/Disaster_recovery_Patroni.md)

In case of a major disaster in which the database volume has been lost refer to [Restoring Backup volumes on OpenShift](https://docs.developer.gov.bc.ca/netapp-backup-restore/)

### Cronjobs

The project consists of several OpenShift [CronJobs](https://docs.openshift.com/container-platform/4.12/rest_api/workloads_apis/cronjob-batch-v1.html) to automatically run the following tasks:

#### Incremental backup

Managed by the PostgresCluster Operator (CrunchyDB), performs an incremental database backup at every 4 hours, starting at 1:00AM Pacific Time.

#### Full backup

As above managed by CrunchyDB. Performs a full backup of the database every day at 1:00AM Pacific Time.

#### Receive applications

Marks all applications for a specific intake as received on the database. Runs twice a day at 10:00 AM and 10:00PM Pacific time.

Sets any applications with status of `submitted` to `received`.

#### Prepare download

Prepares attachments for download from the S3 bucket. Runs twice a day at 10:00 AM and 10:00PM Pacific time.

#### Running a CronJob manually

To run any of the CronJobs above manually:

1. Get the name of CronJob you want to run by running: `oc get CronJob`
2. To start the CronJob run: `oc create job --from cronjob/[NAME FROM STEP 1] [YOUR JOB NAME]`. 
   For example assuming the name of the CronJob from step 1 is `ccbc-pgbackrest-repo1-full`
   and we want to name our job my-manual-job then we will run
   ```shell
   oc create job --from cronjob/ccbc-pgbackrest-repo1-full my-manual-job
   ```
3. Once ran you should see `job.batch/[YOUR JOB NAME]` created

Note that you cannot run a job with the same name twice, if you need to rerun a job either delete the old job 
and rerun the command from step 2, or use a different name.

### Certificates
Certificates are generated using the standard BC Government process:

1. Create a submission for certificates through MySC.
2. Generate a CSR or use one already generated and provide it when requested. 
   If a new one is needed, you can use the following command:
   ```shell
   # replace `domain.ca` with the domain you are generating a certificate for.
   openssl req -new -newkey rsa:2048 -nodes -out domain.ca.csr -keyout domain.ca.key \
       -subj "/C=CA/ST=British Columbia/L=Victoria/O=Government of the Province of British Columbia/OU=NetworkBC/CN=domain.ca"
   ```
3. The step above will give you two files, `domain.ca.csr` and `domain.ca.key`. 
   You will _only_ need to share the CSR; the key will be saved in a secret as listed above during deployment.
4. Once complete, you will receive a certificate and a chain. Use them in the `CERT` and `CERT_CA` fields, respectively. 
   You might also need to update `CERT_KEY` if a new CSR was used.
5. Repeat this process for any other certificates you need to renew (e.g., dev, test, etc.).
6. Finally, to update the certificates run the deployment action for each environment that needs updating.
