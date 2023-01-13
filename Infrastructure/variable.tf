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

variable "buckets-to-scan" {
    type = list
    description = "The buckets which need scanning"
    default = ["fapi7b-dev-ccbc-data"]
}

variable "clamav-definitions-bucket" {
    description = "The name of the bucket which will contain clamav definitions"
    default = "fapi7b-dev-ccbc-clamav"
}

variable "sns-name" {
    description = "The name of the SNS topic for ClamAV lambda notifications"
    default = "clamav-notification"
}
variable "sns-name-export" {
    description = "The name of the SNS topic for export attachment"
    default = "ccbc-export-files"
}