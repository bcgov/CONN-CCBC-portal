// module terraform_aws_asg

// The ID of the created autoscaling group.
output "autoscaling_group_id" {
  value = "aws_autoscaling_group.autoscaling_group.id"
}

// The ID of the created instance security group.
output "instance_security_group_id" {
  value = "module.autoscaling_instance_security_group.security_group_id"
}

// The ARN of the autoscaling group's increase capacity policy.
output "autoscaling_increase_capacity_policy_arn" {
  value = "aws_autoscaling_policy.autoscaling_policy_increase_capacity.arn"
}

// The ARN of the autoscaling group's decrase capacity policy.
output "autoscaling_decrease_capacity_policy_arn" {
  value = "aws_autoscaling_policy.autoscaling_policy_decrease_capacity.arn"
}

// The ARN of the created ALB target group, if one was created.
output "alb_target_group_arn" {
  value = "aws_alb_target_group.autoscaling_alb_target_group.arn"
}

// The ARN of the created ALB listener rule, if one was created.
output "alb_listener_rule_arn" {
  value = "aws_alb_listener_rule.autoscaling_alb_listener_rule.arn"
}
