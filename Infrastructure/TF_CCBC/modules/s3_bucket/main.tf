data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

variable "vpc_id" {
  type = string
}
variable "bucket_name" {
  type = string
}

locals {
    # This generates a string formated for a json policy document resource list for the vpc endpoint
    s3_buckets = "arn:aws:s3:::${var.bucket_name}"
}

resource "aws_s3_bucket" "this" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_acl" "this" {
  bucket = aws_s3_bucket.this.bucket
  acl    = "private"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "this" {
  bucket = aws_s3_bucket.this.bucket

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_cors_configuration" "this" {
  bucket = aws_s3_bucket.this.bucket

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_public_access_block" "this" {
  bucket = aws_s3_bucket.this.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_vpc_endpoint" "endpoint_gateway_to_s3" {
  service_name    = "com.amazonaws.${data.aws_region.current.name}.s3" 
  vpc_id          = var.vpc_id

  # https://docs.aws.amazon.com/vpc/latest/userguide/vpce-gateway.html
  policy = <<POLICY
  {
    "Statement": [
      {
        "Sid": "Access-to-bucket-via-privatelink",
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:*",
        "Resource": ["${local.s3_buckets}"]
      }
    ],
    "Version": "2008-10-17"
  }
POLICY

  tags = {
    Name      = "ccbc-endpoint-gateway-to-s3"
    Terraform = true
  }
}
