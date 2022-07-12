// module terraform_aws_alb

// The path of the project in VCS.
variable "project_path" {
  type    = string
  default = ""
}

// If this is set to "true", the ALB will be private, and will not have an
// elastic IP assigned to it. The default is "false", which gives the ELB an
// elastic (public) IP.
variable "internal_alb" {
  type    = string
  default = "false"
}

// The listener subnet IDs.
variable "listener_subnet_ids" {
  type = list
}

// The external port that the ALB will listen to requests on.
variable "listener_port" {
  type    = string
  default = "80"
}

// The listener protocol. Can be one of HTTP or HTTPS.
variable "listener_protocol" {
  type    = string
  default = "HTTP"
}

// Restrict access to specified networks, supplied as list.
variable "restrict_to_networks" {
  type    = list
  default = ["0.0.0.0/0"]
}

// The ARN of the server certificate you want to use with the listener.
// Required for HTTPS listeners.
variable "listener_certificate_arn" {
  type    = string
  default = ""
}

// The port that the default target group will pass requests to.
variable "default_target_group_port" {
  type    = string
  default = "80"
}

// The protocol for the default target group.
variable "default_target_group_protocol" {
  type    = string
  default = "HTTP"
}
