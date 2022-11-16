# CCBC AWS Infrustructure automated setup

Set of projects/Terraform scripts to provision environment for a node.js app.
Uses Terraform Cloud to store state and get temporary credentials based on "license plate".

## How to make it work
- download project locally 
- install terraform locally 
- run 'terraform init'
- run 'terraform plan'
- run 'terraform apply -auto-approve'
- confirm that all AWS services are created as expected

If you need to rollback please note that Terraform willnot destroy s# bucket if it has any objects.
If you need to destroy anyway - please empty s3 bucket via AWS console first, then run 'terraform destroy -auto-approve'

## How to provision another bucket 
- !DO NOT MODIFY EXISTING VARIABLE `bucket_name`
- create new variable in `variable.tf` file - i.e.
```
variable "foobar_bucket_name" {
    default = "fapi7b-dev-ccbc-foobar"
}
``` 
- in `main.tf` create new module referencing new variable
```
module "foobar_s3" {
  source  = "./modules/s3_bucket"
  vpc_id = data.aws_vpc.selected.id
  bucket_name = var.foobar_bucket_name 
}
```
- run 'terraform init'
- run 'terraform plan'
- confirm that plan does not contain any `destroy` actions, only 5 resources to be added
- run 'terraform apply -auto-approve'
- confirm that new s3 bucket is created as expected

Please note that variables use `dev` as target environment. If the same bucket need to be created in another environment, please follow the next steps:
- find `dev` and replace it with `test` in `variable.tf` file
- find `dev` and replace it with `test` in `main.tf` file (line 7 only)
- run 'terraform init -reconfigure'
- run 'terraform plan'
- confirm that plan does not contain any `destroy` actions, only 5 resources to be added
- run 'terraform apply -auto-approve'
- confirm that new s3 bucket is created as expected

## ClamAV virus scan

Provided terraform modules also ensure provisioning of the ClamAV virus scanner for files in S3 bucket. 
Infrastructure includes lambda, lambda layer, CloudWatch event to periodically update virus definition database and all necessary roles/permissions. Due to the size limitation, lambda layer archive was excluded from current project and it has to be deployed to S3 bucket. terraform expect it to be named `clamav_lambda_layer.zip` and it should be stored in `fapi7b-XXX-ccbc-data` bucket.

Uploading any file in the `fapi7b-XXX-ccbc-data` bucket triggers virus scan that results in tag `av-status` to be set to `clean` or `dirty`. Application that reads the file from S3 can decide what to do with infected file.

It is possible to setup additional permissions on S3 bucket to prevent use of infected file - just add next lines to `scanner.tf`

```
data "aws_caller_identity" "current" {}

// Add a policy to the bucket that prevents download of infected files
resource "aws_s3_bucket_policy" "buckets-to-scan" {
  count = "${length(var.buckets-to-scan)}"
  bucket = "${element(var.buckets-to-scan, count.index)}"

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "NotPrincipal": {
          "AWS": [
              "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root",
              "arn:aws:sts::${data.aws_caller_identity.current.account_id}:assumed-role/${aws_iam_role.bucket-antivirus-scan.name}/${aws_lambda_function.scan-file.function_name}",
              "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/${aws_iam_role.bucket-antivirus-scan.name}"
          ]
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${element(var.buckets-to-scan, count.index)}/*",
      "Condition": {
          "StringNotEquals": {
              "s3:ExistingObjectTag/av-status": "CLEAN"
          }
      }
    }
  ]
}
POLICY
}

```


	
