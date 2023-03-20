provider "aws" {
    region = "ca-central-1"
    profile="default"
}

resource "aws_default_vpc" "default" {
  tags = {
    Name = "Default VPC"
  }
}
data "aws_vpc" "selected" {
  id = aws_default_vpc.default.id
  state = "available"
}

data "aws_caller_identity" "current" {}

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
  local_existing_package = "clamav_lambda_layer.zip"
  # s3_existing_package = {
  #   bucket = var.bucket_name 
  #   key    = "clamav_lambda_layer.zip"
  # }
}
