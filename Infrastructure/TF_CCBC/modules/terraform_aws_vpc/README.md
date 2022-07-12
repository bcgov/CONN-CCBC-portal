# terraform_aws_vpc

Module `terraform_aws_vpc` provides a Terraform module to create an AWS VPC,
with public subnets, routing tables, and internet gateways. Its
opinionated design assumes you want redundancy, spreading out created
subnets across availability zones without any necessary prior knowledge of
what region the subnets are being deployed to.

Usage Example:

    module "vpc" {
      source                  = "../terraform_aws_vpc?ref=VERSION"
      vpc_network_address     = "10.0.0.0/24"
      public_subnet_addresses = ["10.0.0.0/25", "10.0.0.128/25"]
      project_path            = "your/project"
    }

If more than one subnet is specified, this module will automatically
try to spread these out across the availability zones available to you
in the connected region. This helps facilitate redundancy. You are not
limited to the number of subnets you can specify, but keep in mind that
the module will wrap subnets if more subnets are specififed than
availability zones available to you.



## Inputs

| Name | Description | Default | Required |
|------|-------------|:-----:|:-----:|
| map_public_addresses | Default new instances to have public IP addresses. | `true` | no |
| project_path | The path to the project in VCS. | `` | no |
| public_subnet_addresses | Network addresses for subnets to create this VPC.<br><br>If more than one address is specified, the subnets are created across all available availability zones sequentially, wrapping around when the last availability zone for the region is reached. | - | yes |
| public_subnet_name_prefix |  | `Public` | no |
| vpc_name | Name to assign to the VPC | `` | no |
| vpc_network_address | The network address for the VPC. | - | yes |

## Outputs

| Name | Description |
|------|-------------|
| default_network_acl_id | The default network ACL ID for the VPC. |
| public_route_table_id | The public route table ID for the created VPC. |
| public_subnet_availability_zones | The availability zones for the the created public subnets, as a subnet ID -> zone map. |
| public_subnet_ids | The IDs of the created public subnets. |
| vpc_id | The ID of the created VPC. |

