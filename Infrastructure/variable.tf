#--variable/root--
variable "target_aws_account_id" {}

variable "target_env" {}

variable "license_plate" {
    default = "fapi7b"
}

variable "bucket_name" {
    default = "fapi7b-dev-ccbc-data"
}

variable "backup_bucket_name" {
    default = "fapi7b-dev-ccbc-dbbackup"
}

variable "aws_security_group_a" {
  description = "Value of the name tag for the security group in AZ a"
  default     = "App_sg"
}

variable "subnet_a" {
  description = "Value of the name tag for the subnet in AZ a"
  default     = "App_Dev_aza_net"
}

variable "subnet_b" {
  description = "Value of the name tag for the subnet in AZ b"
  default     = "App_Dev_azb_net"
}

variable "efs_name" {
    description = "Name of the EFS"
    default = "clamav-definitions"
}

variable "efs_system_id" {
    description = "ID of EFS (search by name is not supported)"
    default = "fs-00bdeb7b551c87d66"
}

variable "buckets-to-scan" {
    type = list
    description = "The buckets which need scanning"
    default = ["fapi7b-dev-ccbc-data"]
}

variable "clamav-definitions-bucket" {
    description = "The name of the bucket which will contain clamav definitions"
    default = "fapi7b-dev-ccbc-clamav"
}