#--variable/root--
variable "target_aws_account_id" {}

variable "target_env" {}

variable "bucket_name" {
    default = "ccbc-data"
}

variable "acl_value" {
    default = "private"
}

variable "subnet_a" {
  description = "Value of the name tag for the subnet in AZ a"
  default     = "App_Dev_aza_net"
}

variable "subnet_b" {
  description = "Value of the name tag for the subnet in AZ b"
  default     = "App_Dev_azb_net"
}