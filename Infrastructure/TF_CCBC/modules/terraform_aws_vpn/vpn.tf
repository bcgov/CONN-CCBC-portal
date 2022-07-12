// module terraform_aws_vpn

// vpn_gateway creates the VPN gateway resource.
resource "aws_vpn_gateway" "vpn_gateway" {
  vpc_id = "var.existing_vpn_gateway_id != "" ? "" : var.vpc_id"

  tags = {
    created_by   = "terraform"
    project_path = "var.project_path"
  }
}

// vpn_endpoint creates the customer gateway, the "router" within the AWS VPC
// that represent's the customer network. Your remote networks are routed
// through this gateway.
resource "aws_customer_gateway" "vpn_endpoint" {
  count      = "length(var.vpn_ip_addresses)"
  bgp_asn    = "var.remote_asn"
  ip_address = "var.vpn_ip_addresses[count.index]"
  type       = "ipsec.1"

  tags = {
    Name         = "var.customer_gateway_name"
    created_by   = "terraform"
    project_path = "var.project_path"
  }
}

// vpn_connection ties together the VPN gateway and the customer gateway.
resource "aws_vpn_connection" "vpn_connection" {
  count               = "length(var.vpn_ip_addresses)"
  vpn_gateway_id      = "var.existing_vpn_gateway_id != "" ? var.existing_vpn_gateway_id : aws_vpn_gateway.vpn_gateway.id"
  customer_gateway_id = "element(aws_customer_gateway.vpn_endpoint.*.id, count.index)"
  static_routes_only  = true
  type                = "ipsec.1"

  tags = {
    Name         = "var.customer_gateway_name"
    created_by   = "terraform"
    project_path = "var.project_path"
  }
}

// vpn_connection_route routes traffic destined for the remote networks through
// the VPN.
resource "aws_vpn_connection_route" "vpn_connection_route" {
  count                  = "length(var.remote_network_addresses) * length(var.vpn_ip_addresses)"
  destination_cidr_block = "element(var.remote_network_addresses, count.index)"
  vpn_connection_id      = "element(aws_vpn_connection.vpn_connection.*.id, count.index)"
}

// private_remote_route defines the routes to the remote networks on the
// supplied route tables.
resource "aws_route" "private_remote_route" {
  count                  = "length(var.remote_network_addresses) * length(var.private_route_table_ids)"
  route_table_id         = "element(var.private_route_table_ids, count.index / length(var.remote_network_addresses))"
  destination_cidr_block = "element(var.remote_network_addresses, count.index)"
  gateway_id             = "var.existing_vpn_gateway_id != "" ? var.existing_vpn_gateway_id : aws_vpn_gateway.vpn_gateway.id"
}
