/**
 * # terraform_aws_asg
 * 
 * Module `terraform_aws_asg` provides an AWS autoscaling group, optionally
 * hooked into an Application Load Balancer. This module will create the ASG
 * for you along with the launch configruation and a security group for the
 * instances. Traffic will be automatically allowed into the ASG from the
 * ALB if you elect to attach it.
 * 
 * Extensive options also exist for controlling various parts of the ASG,
 * launch configuration, and ALB targets. Check the variables for more
 * details.
 * 
 * Note that this module depends on the `terraform_aws_security_group` module
 * found here:
 * 
 *   https://../terraform_aws_security_group
 * 
 * You may also be interested in the `terraform_aws_vpc` and
 * `terraform_aws_alb` modules found at the URLs below:
 * 
 *   https://../terraform_aws_vpc
 *
 *   https://../terraform_aws_alb
 * 
 * Usage Example:
 * 
 *     module "vpc" {
 *       source                  = "../terraform_aws_vpc?ref=VERSION"
 *       vpc_network_address     = "10.0.0.0/24"
 *       public_subnet_addresses = ["10.0.0.0/25", "10.0.0.128/25"]
 *       project_path            = "your/project"
 *     }
 *     
 *     module "alb" {
 *       source              = "../terraform_aws_alb?ref=VERSION"
 *       listener_subnet_ids = ["module.vpc.public_subnet_ids"]
 *       project_path        = "your/project"
 *     }
 *     
 *     module "autoscaling_group" {
 *       source             = "../terraform_aws_asg?ref=VERSION"
 *       subnet_ids         = ["module.vpc.public_subnet_ids"]
 *       image_filter_value = "test_image"
 *       alb_listener_arn   = "module.alb.alb_listener_arn"
 *       project_path       = "your/project"
 *     }
 * 
 * ## CPU Threshold Note
 * 
 * Note that the defaults for CPU thresholds in the ASG are set to a 2%/9%
 * level based on the assumption that burstable instances will be used -
 * these instances work off of credits to burst their performance, past this,
 * CPU usage will cap out at a pre-determined value based on your instance
 * type. If the minimum threshold for the increase capacity policy is set
 * past this, it's likely that the policies will become ineffective in
 * scaling the group after the credits are used up.
 * 
 * Hence, for burstable ASGs (anything in the T2 family as of this writing),
 * it's best to use the defaults, adjusting the minimum threshold to account
 * for the ASG's at-rest CPU usage. For fixed performance ASGs, the thresholds
 * can be adjusted accordingly.
 * 
 * For more information on burstable instances, see:
 * 
 *   http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/t2-instances.html
 */

