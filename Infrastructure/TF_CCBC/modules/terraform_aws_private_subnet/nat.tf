// module terraform_aws_private_subnet

// nat_gw_public_ip_addresses defines the public IP addresses that will be used
// by the NAT gateways.
resource "aws_eip" "nat_gw_public_ip_addresses" {
  count = var.nat_gateway_count
  vpc   = true
}

// nat_gws defines the NAT gateways.
// 
// One NAT gateway should be created per supplied public subnet ID. This
// ensures that regardless of if the subnets reside in different
// availability zones, there is no risk of connectivity loss, should one AZ go
// offline.
resource "aws_nat_gateway" "nat_gws" {
  count         = var.nat_gateway_count
  allocation_id = element(aws_eip.nat_gw_public_ip_addresses.*.id, count.index)
  subnet_id     = element(var.public_subnet_ids, count.index)[0]
  // var.public_subnet_ids[count.index]
}

// nat_default_routes defines the default routes for each of the subnet/NAT
// gateway pairs.
// 
// These are distributed accross the NAT gateways round-robin.
resource "aws_route" "nat_default_routes" {
  count                  = var.nat_gateway_count > 0 ? length(var.private_subnet_addresses) : 0
  route_table_id         = "element(aws_route_table.private_route_tables.*.id, count.index)"
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = "element(aws_nat_gateway.nat_gws.*.id, count.index % var.nat_gateway_count)"  
}

// nat_record_sets creates DNS records for the NAT gateways.
resource "aws_route53_record" "nat_record_sets" {
  count   = var.nat_gateway_count > 0 && var.route53_zone_id != "" && var.route53_domain_name != "" ? var.nat_gateway_count : 0 
  zone_id = "var.route53_zone_id"
  name    = "natgw-count.index.var.route53_domain_name"
  type    = "A"
  ttl     = 60
  records = ["element(aws_nat_gateway.nat_gws.*.public_ip, count.index)"]
}
