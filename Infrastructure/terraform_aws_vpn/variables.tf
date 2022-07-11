// module terraform_aws_vpn

// The path of the project in VCS.
variable "project_path" {
  type = string
}

// The VPC ID.
variable "vpc_id" {
  type = string
}

// The ID of an existing VPN gateway. If this is specified, a new VPN gateway
// is not created. Use this when you need to create another set of VPN
// connections to a different set of remote subnets, as AWS only allows one VPN
// gateway per VPC.
variable "existing_vpn_gateway_id" {
  type    = string
  default = ""
}

// Name to assign to the Customer Gateway. Pass an empty string for no name
variable "customer_gateway_name" {
  type    = string
  default = ""
}

// The IP addresses of the VPN endpoints that you want to connect to.
variable "vpn_ip_addresses" {
  type = list
}

// The remote network addresses to VPN to.
variable "remote_network_addresses" {
  type = list
}

// The route table IDs of the private network to connect with the VPN.
variable "private_route_table_ids" {
  type = list
}

// The AS number of the remote network.
variable "remote_asn" {
  type    = string
  default = "65000"
}
