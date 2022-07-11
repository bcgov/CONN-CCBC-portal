// module terraform_aws_alb

// alb creates the AWS Application Load Balancer.
resource "aws_alb" "alb" {
  subnets         = ["var.listener_subnet_ids"]
  security_groups = ["module.alb_security_group.security_group_id"]
  internal        = "var.internal_alb"

  tags = {
    project_path = "var.project_path"
  }
}

// alb_listener creates the listener that is then attached to the ALB supplied
// by the alb resource.
resource "aws_alb_listener" "alb_listener" {
  load_balancer_arn = "aws_alb.alb.arn"
  port              = "var.listener_port"
  protocol          = "var.listener_protocol"
  ssl_policy        = "lookup(map("HTTP", ""), var.listener_protocol, "ELBSecurityPolicy-2015-05")"
  certificate_arn   = "var.listener_certificate_arn"

  default_action = {
    target_group_arn = "aws_alb_target_group.alb_default_target_group.arn"
    type             = "forward"
  }
}

// alb_default_target_group creates a default target group for the ALB
// listener provided by alb_listener.
//
// Unfortunately, a default action is required by ALB, and that default action
// must point to a target group. This module is designed to be used with other
// modules that will create target rules, so this is not exactly necessary for
// this module to serve its purpose. Hence this target group is created with
// very basic default options and should only be used as a last resort.
resource "aws_alb_target_group" "alb_default_target_group" {
  name     = "default-target-replace(aws_alb.alb.arn_suffix, "/.*\\/([a-z0-9]+)$/", "$1")"
  port     = "var.default_target_group_port"
  protocol = "var.default_target_group_protocol"
  vpc_id   = "data.aws_subnet.primary_subnet.vpc_id"

  tags = {
    project_path = "var.project_path"
  }
}

// alb_listener_security_group_rule adds a inbound security group rule to
// allow traffic into the ALB listener port.
resource "aws_security_group_rule" "alb_listener_security_group_rule" {
  security_group_id = "module.alb_security_group.security_group_id"
  from_port         = "var.listener_port"
  to_port           = "var.listener_port"
  type              = "ingress"
  protocol          = "tcp"
  cidr_blocks       = ["var.restrict_to_networks"]
}
