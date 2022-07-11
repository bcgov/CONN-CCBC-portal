# terraform_aws_private_subnet

Module `terraform_aws_private_subnet` provides a Terraform module to create
a set of private subnets in a VPC, optionally with NAT. Although the module
can be used independently, it is designed for use with the
`terraform_aws_vpc` module found here:

https://../terraform_aws_vpc

Usage Example:

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

The following example above will create 2 private subnets in the same
availability zones that are used when the initial subnets are created in the
`terraform_aws_vpc` module. These subnets will also have outbound NAT
available to them.



## Inputs

| Name | Description | Default | Required |
|------|-------------|:-----:|:-----:|
| project_path | The path to the project in VCS. | `` | no |
| vpc_id | The ID of the VPC to deploy the NAT route tables to. | - | yes |
| public_subnet_ids | The IDs of the public subnets to route outbound traffic for. | - | yes |
| nat_gateway_count | The number of NAT gateways to create.<br><br>This is required due to current limitations in Terraform. The number should be equal to the amount of public subnets that you are passing in, for which one NAT gateway will be created per subnet ID. Less NAT gateways will create an uneven distribution (some subnets will not get one), and more NAT gateways will wrap around, giving you more than one NAT gateway per subnet, which is definitely *not* what you want.<br><br>As a special case, a value of 0 disables NAT altogether. | - | yes |
| private_subnet_addresses | The list of network addresses to create subnets for. | - | yes |
| private_subnet_availability_zones | The availability zones to create the private subnets in.<br><br>It is recommended that this line up with both the public subnet IDs you are NATing to, if appliciable.<br><br>If more subnets are specified than availability zones, the module will spread the subnets out in a round-robin fashion, with some AZs getting more subnets than others. | - | yes |
| route53_zone_id | A Route 53 zone ID to create resource record sets in that are bound the public IP addresses of the NAT gateways.<br><br>No DNS records are created if this value is blank. | `` | no |
| route53_domain_name | A domain name to create resource record sets in that are bound the public IP addresses of the NAT gateways. This domain has to be part of the domain defined in `route53_zone_id`.<br><br>No DNS records are created if this value is blank. | `` | no |

## Outputs

| Name | Description |
|------|-------------|
| private_subnet_ids | The subnet IDs of the created subnets. |
| private_route_table_ids | The route table IDs for the created private subnets. |
| nat_gateway_ids | The IDs of the created NAT gateways. |
| nat_gateway_public_addresses | The public addresses of the NAT gateways. |
| nat_gateway_private_addresses | The private addresses of the NAT gateways. |
| nat_gateway_dns_records | The DNS records created for the NAT gateways. |

