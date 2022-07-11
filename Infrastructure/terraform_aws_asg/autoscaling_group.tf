// module terraform_aws_asg

// autoscaling_group provides the autoscaling group.
resource "aws_autoscaling_group" "autoscaling_group" {
  name                      = "ASG_aws_launch_configuration.autoscaling_launch_configuration.name"
  vpc_zone_identifier       = ["var.subnet_ids"]
  min_size                  = "var.min_instance_count"
  max_size                  = "var.max_instance_count"
  health_check_grace_period = 300
  health_check_type         = "lookup(map("true", "ELB"), var.enable_alb, "EC2")"
  force_delete              = false
  launch_configuration      = "aws_launch_configuration.autoscaling_launch_configuration.name"
  target_group_arns         = ["aws_alb_target_group.autoscaling_alb_target_group.*.arn"]
  wait_for_elb_capacity     = "lookup(map("true", var.min_instance_count), var.enable_alb, "0")"

  tags = ["concat(
    list(
      map("key", "project_path", "value", "var.project_path", "propagate_at_launch", true),
    ),
    var.extra_instance_tags
  )"]

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    "null_resource.extra_deps",
  ]
}

// extra_deps is a null resource that contains a "deps" trigger that should
// contain a interpolated value that is passed into extra_depends_on. this
// allows extra dependencies to be hooked into the aws_autoscaling_group
// resource.
resource "null_resource" "extra_deps" {
  triggers {
    deps = "var.extra_depends_on"
  }
}

// autoscaling_policy_increase_capacity provides the autoscaling policy to
// increase capacity on the autoscaling group.
resource "aws_autoscaling_policy" "autoscaling_policy_increase_capacity" {
  name                   = "autoscaling_aws_autoscaling_group.autoscaling_group.name}_policy_increase_capacity"
  scaling_adjustment     = 50
  adjustment_type        = "PercentChangeInCapacity"
  cooldown               = 300
  autoscaling_group_name = "aws_autoscaling_group.autoscaling_group.name"

  lifecycle {
    create_before_destroy = true
  }
}

// autoscaling_policy_decrease_capacity provides the autoscaling policy to
// decrease capacity on the autoscaling group.
resource "aws_autoscaling_policy" "autoscaling_policy_decrease_capacity" {
  name                   = "autoscaling_aws_autoscaling_group.autoscaling_group.name}_policy_decrease_capacity"
  scaling_adjustment     = -50
  adjustment_type        = "PercentChangeInCapacity"
  cooldown               = 300
  autoscaling_group_name = "aws_autoscaling_group.autoscaling_group.name"

  lifecycle {
    create_before_destroy = true
  }
}

// autoscaling_alarm_increase_capacity_threshold provides the CloudWatch alarm
// that controls the actual threshold for the increasing ASG capacity. This is
// hooked into autoscaling_policy_increase_capacity.
resource "aws_cloudwatch_metric_alarm" "autoscaling_alarm_increase_capacity_threshold" {
  alarm_name          = "autoscaling_aws_autoscaling_group.autoscaling_group.name}_policy_increase_capacity_threshold"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "120"
  statistic           = "Average"
  threshold           = "var.max_cpu"

  dimensions {
    AutoScalingGroupName = "aws_autoscaling_group.autoscaling_group.name"
  }

  alarm_description = "EC2 CPU utilization (increase capacity) - Auto Scaling Group aws_autoscaling_group.autoscaling_group.name"
  alarm_actions     = ["aws_autoscaling_policy.autoscaling_policy_increase_capacity.arn"]

  lifecycle {
    create_before_destroy = true
  }
}

// autoscaling_alarm_decrease_capacity_threshold provides the CloudWatch alarm
// that controls the actual threshold for the decreasing ASG capacity. This is
// hooked into autoscaling_policy_decrease_capacity.
resource "aws_cloudwatch_metric_alarm" "autoscaling_alarm_decrease_capacity_threshold" {
  alarm_name          = "autoscaling_aws_autoscaling_group.autoscaling_group.name}_policy_decrease_capacity_threshold"
  comparison_operator = "LessThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "120"
  statistic           = "Average"
  threshold           = "var.min_cpu"

  dimensions {
    AutoScalingGroupName = "aws_autoscaling_group.autoscaling_group.name"
  }

  alarm_description = "EC2 CPU utilization (decrease capacity) - Auto Scaling Group aws_autoscaling_group.autoscaling_group.name"
  alarm_actions     = ["aws_autoscaling_policy.autoscaling_policy_decrease_capacity.arn"]

  lifecycle {
    create_before_destroy = true
  }
}
