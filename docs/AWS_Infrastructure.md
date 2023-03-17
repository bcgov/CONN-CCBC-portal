# AWS Infrastructure

Project uses Amazon services to save uploaded files, scan them for viruses and provide analysts with complete set of files associated with all applications in the intake.
Amazon S3 is an easy-to-use, scalable, and cheap storage service that allows to manage costs, meet regulatory requirements, reduce latency, and provide scalable and reliable file storage.

### Purpose

The purpose of this document is to provide high-level overview of Amazon services used in the solution.

## Provisioning

CCBC project uses Terrafrom Cloud to provision AWS infrastructure. Terraform is an open-source infrastructure-as-code software tool created by HashiCorp that allows to easily create and remotely manage cloud infrastructure. Terraform Cloud ensures centralized asset management of the infrastructure and Terraform configuirations, including passwords, cloud tokens and variables on Terraform registry in encrypted form.

See [CCBC AWS Infrustructure automated setup](../Infrastructure/README.md) for details.

## Authentication

To be able to run terraform scripts, please run `terraform login` and generate token (see [Cloud Login](https://developer.hashicorp.com/terraform/tutorials/cloud-get-started/cloud-login)). 
CCBC workspace set up to use specific role `BCGOV_XXX_Automation_Admin_Role` which has limited set of permissions, restricted to use of S3 and Lambda only. No IAM or network management operations are allowed. 

If project need to be set up not as a part of BC Gov infrastructure, see section [How to use in any AWS account](AWS_Infrastructure.md#how-to-setup-in-any-aws-account).

## S3 Buckets

Buckets are named using next naiming convention: [NAMESPACE]-[ENVIRONMENT]-CCBC-[NAME] where
 - NAMESPACE is `fapi7b`;
 - ENVIRONMENT is one of `dev`, `test` or `prod`;
 - NAME describes main purpose of the bucket and can be one of `data`, `dbbackup`, `clamav`;

Examples below are using Dev einvironment.

1. Data (i.e. `fapi7b-dev-ccbc-data`)

    This is a main bucket used to store user-uploaded files. Files are stored as objects with names which are Globally Unique Identifiers (GUIDs). 

    This bucket is used by `scan-bucket-file` lambda function.

2. ClamAV (i.e. `fapi7b-dev-ccbc-clamav`)

    This is a bucket that stores ClamAV virus definition files (`XXX.cvd`), ClamAV configuration `freshclam.dat` and also stores list of attchaments for each intake. This bucket is used by three Lambda functions:
- `update-clamav-definitions`
- `scan-bucket-file`
- `export-bucket-files`

3. Database Backup (i.e. `fapi7b-dev-ccbc-dbbackup`)

    This bucket should store database backups. Currently it is not used; backups are stored in OpenShift.


## Lambda functions 

1. `update-clamav-definitions`
    
    Triggered by ClowdWatch event once a day. Function retrieves updated virus definition files from ClamAV servers and upload then into the bucket;

2. `scan-bucket-file` 
    
    Triggered on all object create events in Data bucket. Function uses ClamAV definitions to check if file is infected or not and adds tag `av-status` to each object. Tag can be `clean` or `dirty`. If object marked as `dirty`, message is sent to SNS topic `clamav-notification`

3. `export-bucket-files` 
    
    Triggered on all object create events in ClamAV bucket, but processes only JSON files. Function uses list of attachments from the JSON file to generate zip file with all attachments and upload it to Data bucket, so that file is readily available for download by the analysts;


## Simple Notification Service 

Terraform script provisions SNS topic `clamav-notification` to be used by `scan-bucket-file` lambda to notify about the potentially infected files. Subscription to the topic should be done manually via AWS console and requires user to confirm email address used for subscription.

Optional `clamav-on-demand-scan` topic was created to trigger virus scanning for the files that were uploaded to the bucket before lambda was deployed. 

## How to setup in any AWS account

To be able to run Terraform scripts , `Infrastructure\main.tf` file should be modified to use [local backend](https://developer.hashicorp.com/terraform/language/settings/backends/local) instead of remote, and set provider configuration to use AWS user credentials instead of the role. See [Provider Configuration](https://registry.terraform.io/providers/hashicorp/aws/latest/docs#provider-configuration) for more details. 

Steps are:
- login to your AWS account and create access key. (IAM -> Security Credentials -> Access Keys);
- save new keys into the file `credentials` in specific location: Linux and macOS: `~/.aws/credentials`, Widnows: `%USERPROFILE%\.aws\credentials`);
- copy files from `Infrastructure\demo\` folder into `Infrastructure\`, overwriting `main.tf` and `variable.tf`;
- if present - delete `Infrastructure\.terraform` folder and `Infrastructure\.terraform.lock.hcl` file;
- run 'terraform init'
- run 'terraform plan'
- run 'terraform apply -auto-approve'
- confirm that all AWS services are created as expected

If 'terraform apply' command fails with error "The requested bucket name is not available' or similar, review file `variable.tf` to ensure unique names for the resources and re-try again.

If you need to destroy infrastructure, please note that 'terraform destroy' will leave S3 buckets. To remove all resources, please edit file `Infrastructure\modules\s3_bucket\main.tf`, set `prevent_destroy = false` in line 19, and run 'terraform destroy' again.