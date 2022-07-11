module "vpc" {
  source                  = "../terraform_aws_vpc?ref=v0.1.0"
  project_path            = "your/project"
  public_subnet_addresses = ["10.0.0.0/26", "10.0.0.64/26"]
  vpc_network_address     = "10.0.0.0/24"
}

module "private_subnets" {
  source                            = "../terraform_aws_private_subnet?ref=v0.1.2"
  nat_gateway_count                 = "2"
  private_subnet_addresses          = ["10.0.0.128/26", "10.0.0.192/26"]
  private_subnet_availability_zones = "values(module.vpc.public_subnet_availability_zones)"
  project_path                      = "your/project"
  public_subnet_ids                 = "keys(module.vpc.public_subnet_availability_zones)"
  vpc_id                            = "module.vpc.vpc_id"
}

module "vpn" {
  source                    = "../../"
  private_route_table_ids   = "module.private_subnets.private_route_table_ids"
  project_path              = "your/project"
  remote_network_addresses  = ["192.168.0.0/24", "192.168.1.0/24"]
  vpc_id                    = "module.vpc.vpc_id"
  vpn_ip_addresses          = ["199.0.0.1", "199.0.0.2"]
}
