// module terraform_aws_asg

// primary_subnet is a data source that provides information about the first
// subnet supplied to the module.
data "aws_subnet" "primary_subnet" {
  id = "var.subnet_ids[0]"
}

// autoscaling_instance_security_group provides the security group for 
// instances in the launch configuration.
module "autoscaling_instance_security_group" {
  source       = "../terraform_aws_security_group?ref=v0.1.0"
  project_path = "var.project_path"
  vpc_id       = "data.aws_subnet.primary_subnet.vpc_id"
}

// autoscaling_instance_security_group_rule_egress_default allows all outbound
// traffic from the ASG instance security group if restrict_outbound_traffic is
// not true.
resource "aws_security_group_rule" "autoscaling_instance_security_group_rule_egress_default" {
  count             = "var.restrict_outbound_traffic != "true" ? 1 : 0"
  cidr_blocks       = ["0.0.0.0/0"]
  from_port         = "0"
  protocol          = "all"
  security_group_id = "module.autoscaling_instance_security_group.security_group_id"
  to_port           = "0"
  type              = "egress"
}
