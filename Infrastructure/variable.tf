#--variable/root--

variable "license_plate" {
    default = "dd5a29"
}

variable "bucket_name" {
    default = "dd5a29-test-ccbc-data"
}

variable "backup_bucket_name" {
    default = "dd5a29-test-ccbc-dbbackup"
}

variable "buckets-to-scan" {
    type = list
    description = "The buckets which need scanning"
    default = ["dd5a29-test-ccbc-data"]
}

variable "clamav-definitions-bucket" {
    description = "The name of the bucket which will contain clamav definitions"
    default = "dd5a29-test-ccbc-clamav"
}

variable "sns-name" {
    description = "The name of the SNS topic for ClamAV lambda notifications"
    default = "clamav-notification"
}
