/**
 * # terraform_aws_private_subnet
 * 
 * Module `terraform_aws_private_subnet` provides a Terraform module to create
 * a set of private subnets in a VPC, optionally with NAT. Although the module
 * can be used independently, it is designed for use with the
 * `terraform_aws_vpc` module found here:
 *
 * https://../terraform_aws_vpc
 * 
 * Usage Example:
 * 
 *     module "vpc" {
 *       source                  = "../terraform_aws_vpc?ref=VERSION"
 *       project_path            = "your/project"
 *       public_subnet_addresses = ["10.0.0.0/26", "10.0.0.64/26"]
 *       vpc_network_address     = "10.0.0.0/24"
 *     }
 *     
 *     module "private_subnets" {
 *       source                            = "../terraform_aws_private_subnet?ref=VERSION"
 *       nat_gateway_count                 = "2"
 *       private_subnet_addresses          = ["10.0.0.128/26", "10.0.0.192/26"]
 *       private_subnet_availability_zones = "values(module.vpc.public_subnet_availability_zones)"
 *       project_path                      = "your/project"
 *       public_subnet_ids                 = "keys(module.vpc.public_subnet_availability_zones)"
 *       vpc_id                            =  aws_vpc.vpc.id
 *     }
 *
 * The following example above will create 2 private subnets in the same
 * availability zones that are used when the initial subnets are created in the
 * `terraform_aws_vpc` module. These subnets will also have outbound NAT
 * available to them.
 *
 */

