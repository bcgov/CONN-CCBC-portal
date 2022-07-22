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

module "s3" {
  source  = "./modules/s3_bucket"
  vpc_id = data.aws_vpc.selected.id
  bucket_name = var.bucket_name 
}
