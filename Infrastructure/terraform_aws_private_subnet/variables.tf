// module terraform_aws_private_subnet

// The path to the project in VCS.
variable "project_path" {
  type    = string
  default = ""
}

// The ID of the VPC to deploy the NAT route tables to.
variable "vpc_id" {
  type = string
}

// The IDs of the public subnets to route outbound traffic for.
variable "public_subnet_ids" {
  type = list
}

// The number of NAT gateways to create.
// 
// This is required due to current limitations in Terraform. The number should
// be equal to the amount of public subnets that you are passing in, for which
// one NAT gateway will be created per subnet ID. Less NAT gateways will create
// an uneven distribution (some subnets will not get one), and more NAT
// gateways will wrap around, giving you more than one NAT gateway per subnet,
// which is definitely *not* what you want.
//
// As a special case, a value of 0 disables NAT altogether.
variable "nat_gateway_count" {
  type = string
}

// The list of network addresses to create subnets for.
variable "private_subnet_addresses" {
  type = list
}

// The availability zones to create the private subnets in.
//
// It is recommended that this line up with both the public subnet IDs you are
// NATing to, if appliciable.
//
// If more subnets are specified than availability zones, the module will
// spread the subnets out in a round-robin fashion, with some AZs getting
// more subnets than others.
variable "private_subnet_availability_zones" {
  type = list
}

// A Route 53 zone ID to create resource record sets in that are bound the
// public IP addresses of the NAT gateways.
//
// No DNS records are created if this value is blank.
variable "route53_zone_id" {
  type    = string
  default = ""
}

// A domain name to create resource record sets in that are bound the public IP
// addresses of the NAT gateways. This domain has to be part of the domain
// defined in `route53_zone_id`.
//
// No DNS records are created if this value is blank.
variable "route53_domain_name" {
  type    = string
  default = ""
}
