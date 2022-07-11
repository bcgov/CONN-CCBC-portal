# CCBC AWS Infrustructure automated setup

Set of projects/Terraform scripts to provision environment for a node.js app.
## Notes:

- Implementation is using "free-tier" services/instances
- Terraform is used for bringing AWS components up   
- Following terraform modules are used (cloned from https://github.com/orgs/paybyphone/repositories?q=_aws_&type=all&language=&sort=, Apache 2.0 license)
	- ../terraform_aws_vpc
	- ../terraform_aws_alb
	- ../terraform_aws_asg etc
	
## Project details
Repository consists of three projects:
- Front End code, deployed as a Docker container;
- API ( BackEnd-for-FronEnd), deployed as a Docker container; 
- terraform project (TF_CCBC) to provision necessary infrastrucuture in AWS (VPC, S3 etc.)

## How to make it work
- download all projects locally
- find all creds_example.tf files in project, rename them to creds.tf and enter your AWS keys (creds.tf files listed in .gitignore and should never be committed into GitHub)
- install terraform locally
- open TF_CCBC folder 
- run 'terraform plan'
- run 'terraform apply'
- confirm that all AWS services are created as expected





	
