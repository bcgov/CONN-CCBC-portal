// The path to the project in VCS.
variable "project_path" {
  type    = string
  default = "paybyphone/terraform_aws_private_subnet"
}

// The VPC network address.
variable "vpc_network_address" {
  type    = string
  default = "10.0.0.0/23"
}

// The public network addresses for the VPC.
variable "public_network_addresses" {
  type    = list
  default = ["10.0.0.0/25", "10.0.0.128/25"]
}

// The private network addresses for the VPC.
variable "private_network_addresses" {
  type    = list
  default = ["10.0.1.0/26", "10.0.1.64/26", "10.0.1.128/26", "10.0.1.192/26"]
}

// The route 53 zone ID.
variable "route53_zone_id" {
  type    = string
  default = ""
}

// The route 53 zone ID.
variable "route53_domain_name" {
  type    = string
  default = ""
}
