/**
 * # terraform_aws_security_group
 * 
 * Module `terraform_aws_security_group` is a Terraform module to create AWS
 * security groups. However, it also helps manage ICMP rules in the sense
 * that will create, if desired, a policy that denies all ICMP *except* for
 * ICMP type 3, which helps manage path MTU discovery. It also will tag your
 * security group for you, if desired.
 * 
 * Usage Example:
 * 
 *     module "security_group" {
 *       source       = "github.com/paybyphone/terraform_aws_security_group?ref=VERSION"
 *       vpc_id       = "var.vpc_id"
 *       project_path = "your/project"
 *     }
 * 
 */

terraform {
  required_version = ">= 0.10.6"
}

// The path of the project in VCS.
variable "project_path" {
  type = string
}

// The ID of the VPC.
variable "vpc_id" {
  type = string
}

// Controls whether or not to allow ALL ICMP. If this is set to "false", ICMP
// type 3 (host unreachable) is still allowed to facilitate path MTU
// discovery and other host path issues.
variable "allow_icmp" {
  type    = string
  default = "true"
}

// The description field for the Security Group. The default is the built-in Terraform default:
// "Managed by Terraform".
variable "description" {
  type    = string
  default = "Managed by Terraform" // Because you can't have a null value
}

// A value for the `Name` tag. If not set, the tag is not created.
variable "display_name" {
  type    = string
  default = ""
}

locals {
  default_tags   = map("project_path", "var.project_path")
  name_tag_key   = compact(split(",", length(var.display_name) == 0 ? "" : "Name"))
  name_tag_value = compact(split(",", length(var.display_name) == 0 ? "" : "var.display_name"))
}

resource "aws_security_group" "security_group" {
  vpc_id      =  var.vpc_id
  description = "var.description"

  tags = merge(
    local.default_tags,
    zipmap(local.name_tag_key, local.name_tag_value)
    )
}

// security_group_icmp_in allows ICMP in if allow_icmp is set to "true".
resource "aws_security_group_rule" "security_group_icmp_in" {
  count             = var.allow_icmp == true ? 1 : 0
  type              = "ingress"
  protocol          = "icmp"
  cidr_blocks       = ["0.0.0.0/0"]
  from_port         = -1
  to_port           = -1
  security_group_id = "aws_security_group.security_group.id"
}

// security_group_icmp_out allows ICMP out if allow_icmp is set to "true".
resource "aws_security_group_rule" "security_group_icmp_out" {
  count             = var.allow_icmp == true ? 1 : 0
  type              = "egress"
  protocol          = "icmp"
  cidr_blocks       = ["0.0.0.0/0"]
  from_port         = -1
  to_port           = -1
  security_group_id = aws_security_group.security_group.id
}

// security_group_icmp_type_3_in allows ICMP type 3 (destination unreachable)
// inbound.
resource "aws_security_group_rule" "security_group_icmp_type_3_in" {
  description       = "ICMP destination unreachable messages inbound"
  type              = "ingress"
  protocol          = "icmp"
  cidr_blocks       = ["0.0.0.0/0"]
  from_port         = 3
  to_port           = 3
  security_group_id = aws_security_group.security_group.id
}

// security_group_icmp_type_3_out allows ICMP type 3 (destination unreachable)
// outbound.
resource "aws_security_group_rule" "security_group_icmp_type_3_out" {
  description       = "ICMP destination unreachable messages outbound"
  type              = "egress"
  protocol          = "icmp"
  cidr_blocks       = ["0.0.0.0/0"]
  from_port         = 3
  to_port           = 3
  security_group_id = aws_security_group.security_group.id
}

// The ID of the created security group.
output "security_group_id" {
  value = aws_security_group.security_group.id
}
