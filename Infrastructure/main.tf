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

data "aws_security_group" "a" {
  filter {
    name   = "tag:Name"
    values = [var.aws_security_group_a]
  }
}

# data "aws_efs_file_system" "clamav"{
#   filter {
#     name   = "tag:Name"
#     values = [var.efs_name]
#   }
# }

data "aws_efs_file_system" "shared" {
  file_system_id = var.efs_system_id
}

module "s3" {
  source  = "./modules/s3_bucket"
  vpc_id = data.aws_vpc.selected.id
  bucket_name = var.bucket_name 
}

module "db_backup" {
  source  = "./modules/s3_bucket"
  vpc_id = data.aws_vpc.selected.id
  bucket_name = var.backup_bucket_name 
}

module "lambda_layer_s3" {
  source = "terraform-aws-modules/lambda/aws"

  create_layer = true

  layer_name          = "clamav-lambda-layer-s3"
  description         = "ClamAV lambda layer (deployed from S3)"
  compatible_runtimes = ["nodejs16.x"]
  compatible_architectures = ["x86_64","arm64"]

  create_package  = false
  s3_existing_package = {
    bucket = var.bucket_name 
    key    = "clamav_lambda_layer.zip"
  }
  vpc_subnet_ids         = [data.aws_subnet.a.id, data.aws_subnet.b.id]
  vpc_security_group_ids = [data.aws_security_group.a.id]
  attach_network_policy  = true

  ######################
  # Elastic File System
  ######################

  file_system_arn              = aws_efs_access_point.lambda.arn
  file_system_local_mount_path = "/mnt/shared-storage"

  # Explicitly declare dependency on EFS mount target.
  # When creating or updating Lambda functions, mount target must be in 'available' lifecycle state.
  # Note: depends_on on modules became available in Terraform 0.13
  depends_on = [aws_efs_mount_target.alpha]
}

# resource "aws_efs_file_system" "shared" {
#   tags = {
#     Name = "ClamAV"
#   }
# }

resource "aws_efs_mount_target" "alpha" {
  file_system_id  = data.aws_efs_file_system.shared.id
  subnet_id       = data.aws_subnet.a.id
  security_groups = [data.aws_security_group.a.id]
}

resource "aws_efs_access_point" "lambda" {
  file_system_id = data.aws_efs_file_system.shared.id

  posix_user {
    gid = 1000
    uid = 1000
  }

  root_directory {
    path = "/lambda"
    creation_info {
      owner_gid   = 1000
      owner_uid   = 1000
      permissions = "0777"
    }
  }
}