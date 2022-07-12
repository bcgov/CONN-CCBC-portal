#--main/root--
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

locals {
    # This generates a string formated for a json policy document resource list for the vpc endpoint
    s3_buckets = "arn:aws:s3:::${var.bucket_name}"
}

variable "vpc_id" {
  type = string
}
variable "bucket_name" {
  type = string
}
variable "route_table_ids" {
    type = list
}


resource "aws_s3_bucket" "secure_bucket" {
  bucket        = var.bucket_name
  force_destroy = false
  acl = "private"

  tags = {
    Name        = "secure-bucket"
    Environment = "Dev"
  }

}

resource "aws_s3_bucket_acl" "secure_bucket_acl" {
  bucket = aws_s3_bucket.secure_bucket.id
  acl    = "private"
}

resource "aws_s3_bucket_policy" "producer_bucket_policy" {
  bucket = aws_s3_bucket.secure_bucket.id

  depends_on = [ aws_s3_bucket_public_access_block.secure_bucket_block_pub_access ]

  policy = <<POLICY
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Access-to-specific-VPCE-only",
            "Principal": {
                "AWS": "${data.aws_caller_identity.current.arn}"
            },
            "Action": [
                "s3:GetBucketLocation",
                "s3:ListBucket",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:PutObject"
            ],
            "Effect": "Deny",
            "Resource": ["${local.s3_buckets}"],
            "Condition": {
                "StringNotEquals": {
                    "aws:sourceVpce": "${aws_vpc_endpoint.endpoint_gateway_to_s3.id}"
                }
            }
        }
    ]
}
POLICY
}

resource "aws_s3_bucket_public_access_block" "secure_bucket_block_pub_access" {
    bucket = aws_s3_bucket.secure_bucket.id
    
    block_public_acls   = true
    block_public_policy = true
    ignore_public_acls      = true
    restrict_public_buckets = true

 }

# code for the creation of a VPC Endpoint and associating it with private route table
resource "aws_vpc_endpoint" "endpoint_gateway_to_s3" {
  route_table_ids = var.route_table_ids
  //service_name    = "com.amazonaws.${data.aws_region.current.name}.s3"
  service_name    = "com.amazonaws.ca-central-1.s3"
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
