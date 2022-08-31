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




	
