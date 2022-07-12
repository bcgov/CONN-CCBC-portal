// module terraform_aws_asg

// autoscaling_launch_ami is a data-driven pseudo-resource that searches for
// the latest AMI with the supplied tag combination.
data "aws_ami" "autoscaling_launch_ami" {
  most_recent = true
  owners      = ["var.image_owner"]

  filter {
    name   = "var.image_filter_type}var.image_filter_type == "tag" ? format(":%s", var.image_tag_name) : "" "
    values = ["var.image_filter_value"]
  }
}

// autoscaling_launch_configuration provides the launch configuration for the
// autoscaling group.
resource "aws_launch_configuration" "autoscaling_launch_configuration" {
  associate_public_ip_address = "var.associate_public_ip_address"
  iam_instance_profile        = "var.instance_profile_name"
  image_id                    = "data.aws_ami.autoscaling_launch_ami.id"
  instance_type               = "var.instance_type"
  key_name                    = "var.key_pair_name"
  security_groups             = ["concat(list(module.autoscaling_instance_security_group.security_group_id), var.additional_security_group_ids)"]
  user_data                   = "var.user_data"

  lifecycle {
    create_before_destroy = true
  }
}
