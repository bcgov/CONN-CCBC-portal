//
module "vpc" {
  source                  = "../terraform_aws_vpc"
  vpc_name                = "ccbc"
  public_subnet_name_prefix = "ccbc"
  vpc_network_address     = "10.0.0.0/24"
  public_subnet_addresses = ["10.0.0.0/25", "10.0.0.128/25"]
  project_path            = ""
}
module "private_subnets" {
  source                            = "../terraform_aws_private_subnet"
  nat_gateway_count                 = 2
  private_subnet_addresses          = ["10.0.0.128/26", "10.0.0.192/26"]
  private_subnet_availability_zones = keys(module.vpc.public_subnet_availability_zones)
  project_path                      = "/TF_CCBC"
  public_subnet_ids                 = module.vpc.public_subnet_ids
  vpc_id                            = module.vpc.vpc_id
}
module "security_group" {
  source       = "../terraform_aws_security_group"
  vpc_id       = module.vpc.vpc_id
  project_path = ""
}

module "s3" {
  source  = "../terraform_aws_s3"
  vpc_id = module.vpc.vpc_id
  bucket_name = var.bucket_name
  route_table_ids = module.private_subnets.private_route_table_ids
}

resource "aws_security_group" "ccbc_security_group" {
  name = "ccbc-sg"
  description = "ccbcdemo security group."
  vpc_id = module.vpc.vpc_id
}

resource "aws_security_group_rule" "ssh_ingress_access" {
  type = "ingress"
  from_port = 22
  to_port = 22
  protocol = "tcp"
  cidr_blocks = [ "0.0.0.0/0" ] 
  security_group_id = aws_security_group.ccbc_security_group.id
}

resource "aws_security_group_rule" "http_8080_ingress_access" {
  type = "ingress"
  from_port = 8080
  to_port = 8080
  protocol = "tcp"
  cidr_blocks = [ "0.0.0.0/0" ] 
  security_group_id = aws_security_group.ccbc_security_group.id
}

resource "aws_security_group_rule" "http_8000_ingress_access" {
  type = "ingress"
  from_port = 8000
  to_port = 8000
  protocol = "tcp"
  cidr_blocks = [ "0.0.0.0/0" ] 
  security_group_id = aws_security_group.ccbc_security_group.id
}

resource "aws_security_group_rule" "pg_ingress_access" {
  type = "ingress"
  from_port = 5432
  to_port = 5432
  protocol = "tcp"
  cidr_blocks = [ "0.0.0.0/0" ] 
  security_group_id = aws_security_group.ccbc_security_group.id
}

resource "aws_security_group_rule" "egress_access" {
  type = "egress"
  from_port = 0
  to_port = 65535
  protocol = "tcp"
  cidr_blocks = [ "0.0.0.0/0" ]
  security_group_id = aws_security_group.ccbc_security_group.id
}
resource "aws_db_subnet_group" "main" {
  name       = "main"
  subnet_ids = module.vpc.public_subnet_ids[0]
  tags = {
    Name = "ccbcDB subnet group"
  }
}

resource "template_file" "client_cloud_config" {
    template = "./shared/client_cloud_config.template"
    vars = { 
    }
}

resource "aws_instance" "ccbc1" {
  instance_type = "t2.micro"
  vpc_security_group_ids = [aws_security_group.ccbc_security_group.id]
  associate_public_ip_address = true
  user_data = template_file.client_cloud_config.rendered
  tags = {
    Name = "ccbc1"
  } 
  # random AMI -other linux
  ami = "ami-0b18956f" 
  # availability_zone = "ca-central-1"
  subnet_id = module.vpc.public_subnet_ids[0][0]
}
