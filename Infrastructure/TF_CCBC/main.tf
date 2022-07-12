/* */
terraform {
    backend "remote" {
        hostname     = "app.terraform.io"
        organization = "bcgov"
        workspaces {
          name = "fapi7b-dev"
        //"${{ env.TFC_WORKSPACE }}"
        }
    }
}
provider "aws" {
    region = "ca-central-1"
    assume_role {
        role_arn = "arn:aws:iam::${var.target_aws_account_id}:role/BCGOV_${var.target_env}_Automation_Admin_Role"
    }
}


module "vpc" {
  source                  = "./modules/terraform_aws_vpc"
  vpc_name                = "ccbc"
  public_subnet_name_prefix = "ccbc"
  vpc_network_address     = "10.0.0.0/24"
  public_subnet_addresses = ["10.0.0.0/25", "10.0.0.128/25"]
  project_path            = ""
}
module "private_subnets" {
  source                            = "./modules/terraform_aws_private_subnet"
  nat_gateway_count                 = 2
  private_subnet_addresses          = ["10.0.0.128/26", "10.0.0.192/26"]
  private_subnet_availability_zones = keys(module.vpc.public_subnet_availability_zones)
  project_path                      = "/TF_CCBC"
  public_subnet_ids                 = module.vpc.public_subnet_ids
  vpc_id                            = module.vpc.vpc_id
}
module "security_group" {
  source       = "./modules/terraform_aws_security_group"
  vpc_id       = module.vpc.vpc_id
  project_path = ""
}

module "s3" {
  source  = "./modules/terraform_aws_s3"
  vpc_id = module.vpc.vpc_id
  bucket_name = var.bucket_name
  route_table_ids = module.private_subnets.private_route_table_ids
}

resource "aws_security_group" "ccbc_security_group" {
  name = "ccbc-sg"
  description = "ccbcdemo security group."
  vpc_id = module.vpc.vpc_id
}

resource "aws_security_group_rule" "ssh_ingress_access" {
  type = "ingress"
  from_port = 22
  to_port = 22
  protocol = "tcp"
  cidr_blocks = [ "0.0.0.0/0" ] 
  security_group_id = aws_security_group.ccbc_security_group.id
}

resource "aws_security_group_rule" "http_8080_ingress_access" {
  type = "ingress"
  from_port = 8080
  to_port = 8080
  protocol = "tcp"
  cidr_blocks = [ "0.0.0.0/0" ] 
  security_group_id = aws_security_group.ccbc_security_group.id
}

resource "aws_security_group_rule" "http_8000_ingress_access" {
  type = "ingress"
  from_port = 8000
  to_port = 8000
  protocol = "tcp"
  cidr_blocks = [ "0.0.0.0/0" ] 
  security_group_id = aws_security_group.ccbc_security_group.id
}

resource "aws_security_group_rule" "pg_ingress_access" {
  type = "ingress"
  from_port = 5432
  to_port = 5432
  protocol = "tcp"
  cidr_blocks = [ "0.0.0.0/0" ] 
  security_group_id = aws_security_group.ccbc_security_group.id
}

resource "aws_security_group_rule" "egress_access" {
  type = "egress"
  from_port = 0
  to_port = 65535
  protocol = "tcp"
  cidr_blocks = [ "0.0.0.0/0" ]
  security_group_id = aws_security_group.ccbc_security_group.id
}
