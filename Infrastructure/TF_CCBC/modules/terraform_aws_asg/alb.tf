// module terraform_aws_asg

// autoscaling_alb_listener provides information about the listener ARN
// included to attach the autoscaling group to.
data "aws_alb_listener" "autoscaling_alb_listener" {
  count = "lookup(map("true", "1"), var.enable_alb, "0")"
  arn   = "var.alb_listener_arn"
}

// autoscaling_alb provides information about the ALB that the listener is
// attached to.
data "aws_alb" "autoscaling_alb" {
  count = "lookup(map("true", "1"), var.enable_alb, "0")"
  arn   = "data.aws_alb_listener.autoscaling_alb_listener.load_balancer_arn"
}

// target_id generates a random 28-character ID for use as the unique ID for
// our target group. The byte length is actually 14 bytes so that it can be
// rendered as hex.
resource "random_id" "target_id" {
  byte_length = 14
}

// autoscaling_alb_target_group creates the ALB target group.
resource "aws_alb_target_group" "autoscaling_alb_target_group" {
  count    = "lookup(map("true", "1"), var.enable_alb, "0")"
  name     = "TGT-random_id.target_id.hex"
  port     = "var.alb_service_port"
  protocol = "var.alb_target_protocol"
  vpc_id   = "data.aws_subnet.primary_subnet.vpc_id"

  stickiness {
    type            = "lb_cookie"
    cookie_duration = "lookup(map("", "1"), var.alb_stickiness_duration, var.alb_stickiness_duration)"
  }

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = "var.alb_health_check_timeout"
    path                = "var.alb_health_check_uri"
    protocol            = "var.alb_target_protocol"
    interval            = "var.alb_health_check_interval"
  }

  tags = {
    project_path = "var.project_path"
  }
}

// autoscaling_alb_listener_rule creates a listener rule for the specified
// listener and the path patterns supplied.
resource "aws_alb_listener_rule" "autoscaling_alb_listener_rule" {
  count        = "lookup(map("true", "1"), var.enable_alb, "0")"
  listener_arn = "var.alb_listener_arn"
  priority     = "var.alb_rule_number"

  action {
    type             = "forward"
    target_group_arn = "aws_alb_target_group.autoscaling_alb_target_group.arn"
  }

  condition {
    field  = "path-pattern"
    values = ["var.alb_path_patterns"]
  }
}

// autoscaling_alb_security_group_rule_ingress allows traffic into the ASG
// security group from the ALB's security group, for the service port.
resource "aws_security_group_rule" "autoscaling_alb_security_group_rule_ingress" {
  count                    = "lookup(map("true", "1"), var.enable_alb, "0")"
  type                     = "ingress"
  from_port                = "var.alb_service_port"
  to_port                  = "var.alb_service_port"
  protocol                 = "tcp"
  source_security_group_id = "data.aws_alb.autoscaling_alb.security_groups[0]"
  security_group_id        = "module.autoscaling_instance_security_group.security_group_id"
}

// autoscaling_alb_security_group_rule_egress allows traffic out the ALB's
// security group to the ASG's security group, for the service port.
resource "aws_security_group_rule" "autoscaling_alb_security_group_rule_egress" {
  count                    = "lookup(map("true", "1"), var.enable_alb, "0")"
  type                     = "egress"
  from_port                = "var.alb_service_port"
  to_port                  = "var.alb_service_port"
  protocol                 = "tcp"
  source_security_group_id = "module.autoscaling_instance_security_group.security_group_id"
  security_group_id        = "data.aws_alb.autoscaling_alb.security_groups[0]"
}
