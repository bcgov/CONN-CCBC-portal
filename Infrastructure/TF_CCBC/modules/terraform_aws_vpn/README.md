
# terraform_aws_vpn

This is a Terraform module to create a VPN within an AWS VPC. For more details
on the technology, visit:

http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_VPN.html

This module will set up the VPN gateway, the customer gateway, and all the
routes necessary to connect between the two networks. It does **not** set up
firewall access for you - make sure you have set up any security groups and
network ACLs properly to allow the desired traffic across.

Although the module can be used independently, it is designed for use with
the `terraform_aws_vpc` and `terraform_aws_private_subnet` modules found
here:

https://../terraform_aws_vpc
https://../terraform_aws_private_subnet

Usage example:

    module "vpc" {
      source                  = "../terraform_aws_vpc?ref=VERSION"
      project_path            = "your/project"
      public_subnet_addresses = ["10.0.0.0/26", "10.0.0.64/26"]
      vpc_network_address     = "10.0.0.0/24"
    }

    module "private_subnets" {
      source                            = "../terraform_aws_private_subnet?ref=VERSION"
      nat_gateway_count                 = "2"
      private_subnet_addresses          = ["10.0.0.128/26", "10.0.0.192/26"]
      private_subnet_availability_zones = "${values(module.vpc.public_subnet_availability_zones)}"
      project_path                      = "your/project"
      public_subnet_ids                 = "${keys(module.vpc.public_subnet_availability_zones)}"
      vpc_id                            = "${module.vpc.vpc_id}"
    }

    module "vpn" {
      source                    = "../terraform_aws_vpn?ref=VERSION"
      private_route_table_count = "2"
      private_route_table_ids   = "${module.private_subnets.private_route_table_ids}"
      project_path              = "your/project"
      remote_network_addresses  = ["192.168.0.0/24", "192.168.1.0/24"]
      vpc_id                    = "${module.vpc.vpc_id}"
      vpn_ip_address            = "10.9.8.7"
    }



## Inputs

| Name | Description | Default | Required |
|------|-------------|:-----:|:-----:|
| customer_gateway_name | Name to assign to the Customer Gateway. Pass an empty string for no name | `` | no |
| existing_vpn_gateway_id | The ID of an existing VPN gateway. If this is specified, a new VPN gateway is not created. Use this when you need to create another set of VPN connections to a different set of remote subnets, as AWS only allows one VPN gateway per VPC. | `` | no |
| private_route_table_ids | The route table IDs of the private network to connect with the VPN. | - | yes |
| project_path | The path of the project in VCS. | - | yes |
| remote_asn | The AS number of the remote network. | `65000` | no |
| remote_network_addresses | The remote network addresses to VPN to. | - | yes |
| vpc_id | The VPC ID. | - | yes |
| vpn_ip_addresses | The IP addresses of the VPN endpoints that you want to connect to. | - | yes |

## Outputs

| Name | Description |
|------|-------------|
| vpn_gateway_id | The ID of the VPN gateway in use (either existing or newly created). |

