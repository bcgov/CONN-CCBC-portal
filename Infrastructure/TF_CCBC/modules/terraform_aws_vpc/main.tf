/**
 * # terraform_aws_vpc
 * 
 * Module `terraform_aws_vpc` provides a Terraform module to create an AWS VPC,
 * with public subnets, routing tables, and internet gateways. Its 
 * opinionated design assumes you want redundancy, spreading out created
 * subnets across availability zones without any necessary prior knowledge of
 * what region the subnets are being deployed to.
 * 
 * Usage Example:
 * 
 *     module "vpc" {
 *       source                  = "../terraform_aws_vpc?ref=VERSION"
 *       vpc_network_address     = "10.0.0.0/24"
 *       public_subnet_addresses = ["10.0.0.0/25", "10.0.0.128/25"]
 *       project_path            = "your/project"
 *     }
 * 
 * If more than one subnet is specified, this module will automatically
 * try to spread these out across the availability zones available to you
 * in the connected region. This helps facilitate redundancy. You are not
 * limited to the number of subnets you can specify, but keep in mind that
 * the module will wrap subnets if more subnets are specififed than
 * availability zones available to you.
 * 
 */

// azs provides a list of AWS availability zones to help with creating
// subnets.
data "aws_availability_zones" "azs" {}

// vpc creates the VPC.
resource "aws_vpc" "vpc" {
  cidr_block           = var.vpc_network_address
  enable_dns_hostnames = true

  tags = {
    created_by   = "terraform"
    project_path = var.project_path
    Name         = var.vpc_name
  }
}

// public_subnets creates the subnets defined in public_subnet_addresses, 
// spreading them out across the available availability zones in the region.
resource "aws_subnet" "public_subnets" {
  vpc_id                  = aws_vpc.vpc.id
  count                   = length(var.public_subnet_addresses)
  cidr_block              = element(var.public_subnet_addresses, count.index)
  map_public_ip_on_launch = var.map_public_addresses
  availability_zone       = element(data.aws_availability_zones.azs.names, count.index)

  tags = {
    Name         = format("%s/%s", var.public_subnet_name_prefix, upper(substr(element(data.aws_availability_zones.azs.names, count.index), -1, -1)))
    //var.public_subnet_name_prefix + upper(substr(element(data.aws_availability_zones.azs.names, count.index), -1, -1))
    created_by   = "terraform"
    project_path = "var.project_path"
  }

  lifecycle {
    create_before_destroy = true
  }
}

// public_gateway creates the gateway for public internet access in the VPC. 
// Whether or not this is used depends on the supplied map_public_addresses
// parameter, in addition to any resource-specific parameters supplied.
resource "aws_internet_gateway" "public_gateway" {
  vpc_id =  aws_vpc.vpc.id

  tags = {
    created_by   = "terraform"
    project_path = "var.project_path"
  }
}

// public_route_table defines the route table for the VPC.
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name         = "Public"
    created_by   = "terraform"
    project_path = "var.project_path"
  }
}

// public_default_route defines the default route for the VPC, which goes to
// public_gateway.
resource "aws_route" "public_default_route" {
  route_table_id         = aws_route_table.public_route_table.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.public_gateway.id
}

// public_subnet_assocs associates the VPC's subnets with public_route_table.
resource "aws_route_table_association" "public_subnet_assocs" {
  count          = length(var.public_subnet_addresses)
  route_table_id = aws_route_table.public_route_table.id
  subnet_id      = element(aws_subnet.public_subnets.*.id, count.index)
}
