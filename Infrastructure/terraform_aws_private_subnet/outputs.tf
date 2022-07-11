// module terraform_aws_private_subnet

// The subnet IDs of the created subnets.
output "private_subnet_ids" {
  value      = [aws_subnet.private_subnets.*.id]
  depends_on = [aws_route.nat_default_routes]
}

// The availability zones for the the created private subnets, as a
// subnet ID -> zone map.
output "private_subnet_availability_zones" {
  value = [zipmap(aws_subnet.private_subnets.*.id, aws_subnet.private_subnets.*.availability_zone)]
}

// The route table IDs for the created private subnets.
output "private_route_table_ids" {
  value = aws_route_table.private_route_tables.*.id
}

// The IDs of the created NAT gateways.
output "nat_gateway_ids" {
  value = [aws_nat_gateway.nat_gws.*.id]
}

// The public addresses of the NAT gateways.
output "nat_gateway_public_addresses" {
  value = [aws_nat_gateway.nat_gws.*.public_ip]
}

// The private addresses of the NAT gateways.
output "nat_gateway_private_addresses" {
  value = [aws_nat_gateway.nat_gws.*.private_ip]
}

// The DNS records created for the NAT gateways.
output "nat_gateway_dns_records" {
  value = [aws_route53_record.nat_record_sets.*.fqdn]
}
