// module terraform_aws_private_subnet

// private_subnets creates the private subnets defined in
// private_subnet_address.
resource "aws_subnet" "private_subnets" {
  count                   = length(var.private_subnet_addresses)
  vpc_id                  = var.vpc_id
  availability_zone       = element(var.private_subnet_availability_zones, count.index)
  cidr_block              = element(var.private_subnet_addresses, count.index)
  map_public_ip_on_launch = false

  tags = {
    project_path = "var.project_path"
  }

  lifecycle {
    create_before_destroy = true
  }
}

// private_route_tables defines the route tables for the VPC.
//
// One route table is created per defined subnet address, to ensure
// compatability with multi-AZ NAT gateways.
resource "aws_route_table" "private_route_tables" {
  count  = length(var.private_subnet_addresses)
  vpc_id = var.vpc_id

  tags = {
    project_path = "var.project_path"
  }
}

// private_route_table_subnet_assocs defines the subnet associations that link the
// subnets to the route tables defined in private_route_tables.
resource "aws_route_table_association" "private_route_table_subnet_assocs" {
  count          = length(var.private_subnet_addresses)
  route_table_id = element(aws_route_table.private_route_tables.*.id, count.index)
  subnet_id      = element(aws_subnet.private_subnets.*.id, count.index)
}
