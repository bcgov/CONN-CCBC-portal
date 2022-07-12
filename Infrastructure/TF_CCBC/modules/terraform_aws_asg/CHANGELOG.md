## 0.2.5-pre

Bumped version for dev.

## 0.2.4

This update adds `extra_instance_tags`, which allows the user to supply a list
of hashes with the same syntax as the tag parameter for the
`aws_autoscaling_group` resource. This allows one to supply extra tags that will
get added to the ASG, and propagate to its instances so long as
`propagate_on_launch` is set, which is more than likely what you want. A note
has been added to the docs to this regard as well.

## 0.2.3

Added `additional_security_group_ids` to allow assigning additional security
groups. This can be used to inject security groups created in other modules.

## 0.2.2

`instance_profile_arn` is now `instance_profile_name`, reflecting the true
nature of the option (it has always needed a name and not a full ARN). Also
removed a duplicate reference to this option in the launch configuration, which
could have possibly caused issues using the option.

## 0.2.1

This change adds the `associate_public_ip_address` flag, which sets the
respective option in your launch configuration, ensuring that instances launched
by the ASG have public IP addresses. This can be useful if you don't have or
need a bastion, or are not necessarily using ALB.
    
Note that this does not mean that your hosts are internet accessible other than
via ICMP - you still need to open up the ports via security group rules.

## 0.2.0

BREAKING CHANGES:

 * Image searching behaviour has changed. You can now search on other search
   types, not just tag, although this is still the default behaviour. However,
   to reflect the changes, `image_tag_value` is now `image_filter_value`.

NEW IMAGE SEARCHING FEATURE IN DETAIL:

 * As mentioned, images can now be searched on via other filter types. For a
   full list, see [here][1]. Filter type is now controlled with
   `image_filter_type`. If this is `tag` (the default), `image_tag_name` defines
   the tag name to use in the filter. `image_filter_value` defines the value to
   search on for the filter type defined. `image_owner` has also been added to
   help lock down search results - to help maintain expected behaviour with
   older versions, the default is `self`.

[1]: http://docs.aws.amazon.com/cli/latest/reference/ec2/describe-images.html

OTHER FEATURES:

 * `user_data` can now be supplied to the instance.
 * By default, outbound traffic is now allowed on the created security group for
   the ASG. This helps facilitate bootstrapping and general interoperability
   expectations of the instance without compromising security (inbound is still
   restricted). You can change this behaviour back to restricted to setting
   `restrict_outbound_traffic` to `true`.

## 0.1.1

Fixed rolling update issues. Target group name generation is now independent of
the launch configuration name.

## 0.1.0

Initial release.
