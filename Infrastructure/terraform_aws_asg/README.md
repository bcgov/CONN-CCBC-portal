# terraform_aws_asg

Module `terraform_aws_asg` provides an AWS autoscaling group, optionally
hooked into an Application Load Balancer. This module will create the ASG
for you along with the launch configruation and a security group for the
instances. Traffic will be automatically allowed into the ASG from the
ALB if you elect to attach it.

Extensive options also exist for controlling various parts of the ASG,
launch configuration, and ALB targets. Check the variables for more
details.

Note that this module depends on the `terraform_aws_security_group` module
found here:

  https://../terraform_aws_security_group

You may also be interested in the `terraform_aws_vpc` and
`terraform_aws_alb` modules found at the URLs below:

  https://../terraform_aws_vpc

  https://../terraform_aws_alb

Usage Example:

    module "vpc" {
      source                  = "../terraform_aws_vpc?ref=VERSION"
      vpc_network_address     = "10.0.0.0/24"
      public_subnet_addresses = ["10.0.0.0/25", "10.0.0.128/25"]
      project_path            = "your/project"
    }

    module "alb" {
      source              = "../terraform_aws_alb?ref=VERSION"
      listener_subnet_ids = ["${module.vpc.public_subnet_ids}"]
      project_path        = "your/project"
    }

    module "autoscaling_group" {
      source             = "../terraform_aws_asg?ref=VERSION"
      subnet_ids         = ["${module.vpc.public_subnet_ids}"]
      image_filter_value = "test_image"
      alb_listener_arn   = "${module.alb.alb_listener_arn}"
      project_path       = "your/project"
    }

## CPU Threshold Note

Note that the defaults for CPU thresholds in the ASG are set to a 2%/9%
level based on the assumption that burstable instances will be used -
these instances work off of credits to burst their performance, past this,
CPU usage will cap out at a pre-determined value based on your instance
type. If the minimum threshold for the increase capacity policy is set
past this, it's likely that the policies will become ineffective in
scaling the group after the credits are used up.

Hence, for burstable ASGs (anything in the T2 family as of this writing),
it's best to use the defaults, adjusting the minimum threshold to account
for the ASG's at-rest CPU usage. For fixed performance ASGs, the thresholds
can be adjusted accordingly.

For more information on burstable instances, see:

  http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/t2-instances.html


## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|:----:|:-----:|:-----:|
| additional_security_group_ids | List of additional security groups to assign to the instances in addition to the security group created by this module. | list | `<list>` | no |
| alb_health_check_interval | The time to wait between ALB health checks. Note that this number needs to be lower than health_check_timeout. | string | `10` | no |
| alb_health_check_timeout | The time to wait before marking the ALB health check as failed. Note that this number needs to be lower than health_check_interval. | string | `3` | no |
| alb_health_check_uri | The health check URI to add as the ALB health check. | string | `/` | no |
| alb_listener_arn | The ARN Application Load Balancer (ALB) Listner to attach this ASG to. If you are not using ALB or will be attaching outside of the module, do not specify this value. | string | `` | no |
| alb_path_patterns | A list of URIs to attach to the ALB as target rules, if one is specified. | list | `<list>` | no |
| alb_rule_number | The rule number for the ALB attachment. This rule cannot conflict with other attachments. | string | `100` | no |
| alb_service_port | The service port that the ASG will be listening on for ALB attachments. | string | `80` | no |
| alb_stickiness_duration | The LB stickiness expiration period. This configures LB stickiness, aka session persistence, on the side of the load balancer. Use when the application is not LB-aware on its own. When not specified, the default value is 1 second. Note that zero or negative values will result in an error. | string | `` | no |
| alb_target_protocol | The ALB target protocol. Can be one of HTTP or HTTPS. | string | `HTTP` | no |
| associate_public_ip_address | Map a public IP address to the launched instances in the auto-scaling group. Note that this will fail if the subnet you are using is not attached to an internet gateway. | string | `false` | no |
| enable_alb | `true` if you are attaching this autoscaling group to an Application Load Balancer (ALB). | string | `false` | no |
| extra_depends_on | Extra dependencies to hook into the aws_autoscaling_group resource in this module. This value should be a string that contains interpolations from the resources you want to add as dependencies. | string | `` | no |
| extra_instance_tags | A list of additional tag key/values to add to the autoscaling group. These are supplied as per the [tag parameter](https://www.terraform.io/docs/providers/aws/r/autoscaling_group.html#tag) parameter in the `aws_autoscaling_group` resource. This is in addition to the tag added by supplying `project_path`. These tags only get added to the autoscaling group and the instances it launches, and only if `propagate_at_launch` is set to `true` in the supplied maps (this is the only useful value to supply). | list | `<list>` | no |
| image_filter_type | The image filter type. Can be one of the filter types specified [here](http://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html). | string | `tag` | no |
| image_filter_value | The image filter value to look for. | string | - | yes |
| image_owner | The account to search for the image in. This defaults to "self", but can be either this, numeric account ID, or "amazon". | string | `self` | no |
| image_tag_name | The image tag name to look for, if image_filter_type is "tag" | string | `image_type` | no |
| instance_profile_name | The name of an instance profile to associate with launched instances. | string | `` | no |
| instance_type | The EC2 instance type. | string | `t2.micro` | no |
| key_pair_name | The name of a key pair to launch the ASG instances with.<br><br>Note that this should not be configured in a production environment - this is mainly supposed to be used for development and troubleshooting in sandbox and QA. | string | `` | no |
| max_cpu | Max threshold where instances start being created, in percent. | string | `9` | no |
| max_instance_count | The maximum amount of instances in the group | string | `2` | no |
| min_cpu | Low threshold before instances start being deleted, in percent. | string | `2` | no |
| min_instance_count | The minimum amount of instances in the group. | string | `2` | no |
| project_path | The path of the project in VCS. | string | `` | no |
| restrict_outbound_traffic | Restrict outbound traffic on the ASG's security group. By default, this is `false`, meaning that all traffic outbound from the instance (ie: to package repositories, S3, etc) is enabled. Set this to `true` if you require tighter security on the traffic originating from the ASG and plan on adding your own outbound rules. | string | `false` | no |
| subnet_ids | The subnet IDs to place the autoscaling group in. | list | - | yes |
| user_data | User data, either a cloud-config YAML file or a shell script, to load into the instance. For more information see [here](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html) and [here](http://cloudinit.readthedocs.io/en/latest/index.html). | string | `` | no |

## Outputs

| Name | Description |
|------|-------------|
| alb_listener_rule_arn | The ARN of the created ALB listener rule, if one was created. |
| alb_target_group_arn | The ARN of the created ALB target group, if one was created. |
| autoscaling_decrease_capacity_policy_arn | The ARN of the autoscaling group's decrase capacity policy. |
| autoscaling_group_id | The ID of the created autoscaling group. |
| autoscaling_increase_capacity_policy_arn | The ARN of the autoscaling group's increase capacity policy. |
| instance_security_group_id | The ID of the created instance security group. |

