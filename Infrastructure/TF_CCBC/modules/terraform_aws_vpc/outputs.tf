// module terraform_aws_vpc

// The ID of the created VPC.
output "vpc_id" {
  value = aws_vpc.vpc.id
}

// The default network ACL ID for the VPC.
output "default_network_acl_id" {
  value = aws_vpc.vpc.default_network_acl_id
}

// The IDs of the created public subnets.
output "public_subnet_ids" {
  value = [aws_subnet.public_subnets.*.id]
}

// The availability zones for the the created public subnets, as a
// subnet ID -> zone map.
output "public_subnet_availability_zones" {
  value = zipmap(aws_subnet.public_subnets.*.id, aws_subnet.public_subnets.*.availability_zone)
}

// The public route table ID for the created VPC.
output "public_route_table_id" {
  value = aws_route_table.public_route_table.id
}
