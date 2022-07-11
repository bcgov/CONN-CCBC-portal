/**
 * # terraform_aws_alb
 * 
 * Module `terraform_aws_alb` creates an AWS Application Load Balancer (ALB), and
 * a matching listener.
 * 
 * The module includes a default target group that can be used to put instances
 * into, however lacks health checks. To take full advantage of this module,
 * it's suggested that you use the companion `terraform_aws_asg` module found
 * here:
 * 
 *   https://../terraform_aws_asg
 * 
 * This module also depends on the `terraform_aws_security_group` module found
 * here:
 *
 * https://../terraform_aws_security_group
 * 
 * Finally, you may also be interested in the `terraform_aws_vpc` module found
 * here:
 * 
 *   https://../terraform_aws_vpc
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
 */

