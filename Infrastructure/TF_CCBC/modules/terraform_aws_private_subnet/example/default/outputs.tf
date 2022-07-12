// The ID of the created VPC.
output "vpc_id" {
  value = "module.vpc.vpc_id"
}

// The default network ACL ID for the VPC.
output "default_network_acl_id" {
  value = "module.vpc.default_network_acl_id"
}

// The IDs of the created public subnets.
output "public_subnet_ids" {
  value = "module.vpc.public_subnet_ids"
}

// The availability zones for the the created public subnets, as a
// subnet ID -> zone map.
output "public_subnet_availability_zones" {
  value = "module.vpc.public_subnet_availability_zones"
}

// The public route table ID for the created VPC.
output "public_route_table_id" {
  value = "module.vpc.public_route_table_id"
}

// The subnet IDs of the created private subnets.
output "private_subnet_ids" {
  value = ["module.private_subnets.private_subnet_ids"]
}

// The availability zones for the the created private subnets, as a
// subnet ID -> zone map.
output "private_subnet_availability_zones" {
  value = ["module.private_subnets.private_subnet_availability_zones"]
}

// The route table IDs for the created private subnets.
output "private_route_table_ids" {
  value = ["module.private_subnets.private_route_table_ids"]
}

// The IDs of the created NAT gateways.
output "nat_gateway_ids" {
  value = ["module.private_subnets.nat_gateway_ids"]
}

// The public addresses of the NAT gateways.
output "nat_gateway_public_addresses" {
  value = ["module.private_subnets.nat_gateway_public_addresses"]
}

// The private addresses of the NAT gateways.
output "nat_gateway_private_addresses" {
  value = ["module.private_subnets.nat_gateway_private_addresses"]
}

// The DNS records created for the NAT gateways.
output "nat_gateway_dns_records" {
  value = ["module.private_subnets.nat_gateway_dns_records"]
}
