// vpc provides the VPC module.
module "vpc" {
  source                  = "../terraform_aws_vpc?ref=v0.1.0"
  project_path            = "var.project_path"
  public_subnet_addresses = ["var.public_network_addresses"]
  vpc_network_address     = "var.vpc_network_address"
}

// private_subnets provides the private subnets for the VPC.
module "private_subnets" {
  source                            = "../../"
  nat_gateway_count                 = "length(var.public_network_addresses)"
  private_subnet_addresses          = ["var.private_network_addresses"]
  private_subnet_availability_zones = "distinct(values(module.vpc.public_subnet_availability_zones))"
  project_path                      = "var.project_path"
  public_subnet_ids                 = "keys(module.vpc.public_subnet_availability_zones)"
  route53_domain_name               = "var.route53_domain_name"
  route53_zone_id                   = "var.route53_zone_id"
  vpc_id                            = "module.vpc.vpc_id"
}
