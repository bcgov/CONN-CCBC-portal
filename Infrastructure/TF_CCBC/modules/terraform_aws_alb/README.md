# terraform_aws_alb

Module `terraform_aws_alb` creates an AWS Application Load Balancer (ALB), and
a matching listener.

The module includes a default target group that can be used to put instances
into, however lacks health checks. To take full advantage of this module,
it's suggested that you use the companion `terraform_aws_asg` module found
here:

  https://../terraform_aws_asg

This module also depends on the `terraform_aws_security_group` module found
here:

https://../terraform_aws_security_group

Finally, you may also be interested in the `terraform_aws_vpc` module found
here:

  https://../terraform_aws_vpc

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


## Inputs

| Name | Description | Default | Required |
|------|-------------|:-----:|:-----:|
| project_path | The path of the project in VCS. | `` | no |
| internal_alb | If this is set to "true", the ALB will be private, and will not have an elastic IP assigned to it. The default is "false", which gives the ELB an elastic (public) IP. | `false` | no |
| listener_subnet_ids | The listener subnet IDs. | - | yes |
| listener_port | The external port that the ALB will listen to requests on. | `80` | no |
| listener_protocol | The listener protocol. Can be one of HTTP or HTTPS. | `HTTP` | no |
| restrict_to_networks | Restrict access to specified networks, supplied as list. | `<list>` | no |
| listener_certificate_arn | The ARN of the server certificate you want to use with the listener. Required for HTTPS listeners. | `` | no |
| default_target_group_port | The port that the default target group will pass requests to. | `80` | no |
| default_target_group_protocol | The protocol for the default target group. | `HTTP` | no |

## Outputs

| Name | Description |
|------|-------------|
| alb_security_group_id | The security group ID for the alb. |
| alb_arn | The ARN of the created Application Load Balancer. |
| alb_arn_suffix | The ARN suffix of the created Application Load Balancer. |
| alb_listener_arn | The ARN of the created Application Load Balancer Listener. |
| alb_dns_name | The DNS name of the created Application Load Balancer. |
| alb_zone_id | The route 53 zone ID that can be used to route alias records sets to.<br><br>Note that these are not CNAMEs, but a route that allows Route 53 to respond to A record requests with the actual IP addresses of the ALB. |

