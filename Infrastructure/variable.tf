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
