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





	
