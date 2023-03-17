#--variable/root--

variable "bucket_name" {
    default = "demo-ccbc-data"
}

variable "backup_bucket_name" {
    default = "demo-ccbc-dbbackup"
}

variable "buckets-to-scan" {
    type = list
    description = "The buckets which need scanning"
    default = ["demo-ccbc-data"]
}

variable "clamav-definitions-bucket" {
    description = "The name of the bucket which will contain clamav definitions"
    default = "demo-ccbc-clamav"
}

variable "sns-name" {
    description = "The name of the SNS topic for ClamAV lambda notifications"
    default = "demo-clamav-notification"
}
