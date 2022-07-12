#--variable/root--
variable "target_aws_account_id" {}

variable "target_env" {}

variable "bucket_name" {
    default = "ccbc-data"
}

variable "acl_value" {
    default = "private"
}
