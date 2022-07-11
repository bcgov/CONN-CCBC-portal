# terraform_aws_security_group

Module `terraform_aws_security_group` is a Terraform module to create AWS
security groups. However, it also helps manage ICMP rules in the sense
that will create, if desired, a policy that denies all ICMP *except* for
ICMP type 3, which helps manage path MTU discovery. It also will tag your
security group for you, if desired.

Usage Example:

    module "security_group" {
      source       = "github.com/paybyphone/terraform_aws_security_group?ref=VERSION"
      vpc_id       = "${var.vpc_id}"
      project_path = "your/project"
    }



## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|:----:|:-----:|:-----:|
| allow_icmp | Controls whether or not to allow ALL ICMP. If this is set to "false", ICMP type 3 (host unreachable) is still allowed to facilitate path MTU discovery and other host path issues. | string | `true` | no |
| description | The description field for the Security Group. The default is the built-in Terraform default: "Managed by Terraform". | string | `Managed by Terraform` | no |
| display_name | A value for the `Name` tag. If not set, the tag is not created. | string | `` | no |
| project_path | The path of the project in VCS. | string | - | yes |
| vpc_id | The ID of the VPC. | string | - | yes |

## Outputs

| Name | Description |
|------|-------------|
| security_group_id | The ID of the created security group. |

