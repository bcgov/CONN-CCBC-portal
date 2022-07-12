// module terraform_aws_asg

// The path of the project in VCS.
variable "project_path" {
  type    = string
  default = ""
}

// The subnet IDs to place the autoscaling group in.
variable "subnet_ids" {
  type = list
}

// The minimum amount of instances in the group.
variable "min_instance_count" {
  type    = string
  default = "2"
}

// The maximum amount of instances in the group
variable "max_instance_count" {
  type    = string
  default = "2"
}

// Low threshold before instances start being deleted, in percent.
variable "min_cpu" {
  type    = string
  default = "2"
}

// Max threshold where instances start being created, in percent.
variable "max_cpu" {
  type    = string
  default = "9"
}

// The account to search for the image in. This defaults to "self", but can be
// either this, numeric account ID, or "amazon".
variable "image_owner" {
  type    = string
  default = "self"
}

// The image filter type. Can be one of the filter types specified
// [here](http://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html).
variable "image_filter_type" {
  type    = string
  default = "tag"
}

// The image tag name to look for, if image_filter_type is "tag"
variable "image_tag_name" {
  type    = string
  default = "image_type"
}

// The image filter value to look for.
variable "image_filter_value" {
  type = string
}

// The EC2 instance type.
variable "instance_type" {
  type    = string
  default = "t2.micro"
}

// `true` if you are attaching this autoscaling group to an Application Load
// Balancer (ALB).
variable "enable_alb" {
  type    = string
  default = "false"
}

// The ARN Application Load Balancer (ALB) Listner to attach this ASG
// to. If you are not using ALB or will be attaching outside of the module,
// do not specify this value.
variable "alb_listener_arn" {
  type    = string
  default = ""
}

// The rule number for the ALB attachment. This rule cannot conflict with
// other attachments.
variable "alb_rule_number" {
  type    = string
  default = "100"
}

// A list of URIs to attach to the ALB as target rules, if one is specified.
variable "alb_path_patterns" {
  type    = list
  default = ["/*"]
}

// The service port that the ASG will be listening on for ALB attachments.
variable "alb_service_port" {
  type    = string
  default = "80"
}

// The health check URI to add as the ALB health check. 
variable "alb_health_check_uri" {
  type    = string
  default = "/"
}

// The time to wait before marking the ALB health check as failed. Note that
// this number needs to be lower than health_check_interval.
variable "alb_health_check_timeout" {
  type    = string
  default = "3"
}

// The time to wait between ALB health checks. Note that this
// number needs to be lower than health_check_timeout.
variable "alb_health_check_interval" {
  type    = string
  default = "10"
}

// The ALB target protocol. Can be one of HTTP or HTTPS.
variable "alb_target_protocol" {
  type    = string
  default = "HTTP"
}

// The name of an instance profile to associate with launched instances. 
variable "instance_profile_name" {
  type    = string
  default = ""
}

// The name of a key pair to launch the ASG instances with.
//
// Note that this should not be configured in a production environment -
// this is mainly supposed to be used for development and troubleshooting
// in sandbox and QA.
variable "key_pair_name" {
  type    = string
  default = ""
}

// The LB stickiness expiration period. This configures LB stickiness, aka
// session persistence, on the side of the load balancer. Use when the
// application is not LB-aware on its own. When not specified, the default
// value is 1 second. Note that zero or negative values will result in an
// error.
variable "alb_stickiness_duration" {
  type    = string
  default = ""
}

// Extra dependencies to hook into the aws_autoscaling_group resource in this
// module. This value should be a string that contains interpolations from the
// resources you want to add as dependencies.
variable "extra_depends_on" {
  type    = string
  default = ""
}

// User data, either a cloud-config YAML file or a shell script, to load into
// the instance. For more information see
// [here](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html)
// and [here](http://cloudinit.readthedocs.io/en/latest/index.html).
variable "user_data" {
  type    = string
  default = ""
}

// Restrict outbound traffic on the ASG's security group. By default, this is
// `false`, meaning that all traffic outbound from the instance (ie: to package
// repositories, S3, etc) is enabled. Set this to `true` if you require tighter
// security on the traffic originating from the ASG and plan on adding your own
// outbound rules.
variable "restrict_outbound_traffic" {
  type    = string
  default = "false"
}

// Map a public IP address to the launched instances in the auto-scaling group.
// Note that this will fail if the subnet you are using is not attached to an
// internet gateway.
variable "associate_public_ip_address" {
  type    = string
  default = "false"
}

// List of additional security groups to assign to the instances in addition to
// the security group created by this module.
variable "additional_security_group_ids" {
  type    = list
  default = []
}

// A list of additional tag key/values to add to the autoscaling group. These
// are supplied as per the [tag
// parameter](https://www.terraform.io/docs/providers/aws/r/autoscaling_group.html#tag)
// parameter in the `aws_autoscaling_group` resource. This is in addition to
// the tag added by supplying `project_path`. These tags only get added to the
// autoscaling group and the instances it launches, and only if
// `propagate_at_launch` is set to `true` in the supplied maps (this is the
// only useful value to supply).
variable "extra_instance_tags" {
  type    = list
  default = []
}
