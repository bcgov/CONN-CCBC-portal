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
data "aws_vpc" "selected" {
  state = "available"
}

data "aws_subnet" "a" {
  filter {
    name   = "tag:Name"
    values = [var.subnet_a]
  }
}

data "aws_subnet" "b" {
  filter {
    name   = "tag:Name"
    values = [var.subnet_b]
  }
}

module "s3" {
  source  = "./modules/s3_bucket"
  vpc_id = data.aws_vpc.selected.id
  bucket_name = var.bucket_name 
}

resource "aws_security_group" "ccbc_security_group" {
  name        = "ccbc-sg"
  description = "Security group for CCBC"
  vpc_id      = data.aws_vpc.selected.id
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["127.0.0.1/32"]
    self        = true
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group_rule" "ssh_ingress_access" {
  type = "ingress"
  from_port = 22
  to_port = 22
  protocol = "tcp"
  cidr_blocks = [ "0.0.0.0/0" ] 
  security_group_id = aws_security_group.ccbc_security_group.id
}
