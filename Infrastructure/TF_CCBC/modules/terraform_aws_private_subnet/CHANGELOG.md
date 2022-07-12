## 0.1.4-pre

Bumped version for dev.

## 0.1.3

Added the `private_subnet_availability_zones` output, which behaves in the same
way as the [terraform_aws_vpc](https://../terraform_aws_vpc)
module, providing a subnet ID -> availability zone association that can be used
to locate the availability zone for a particular subnet.
    
## 0.1.2

Fixed the `private_subnets` resource so that index does not go out of range when
computing a number of subnets larger than the available availability zones.
This was due to this resource using list notation instead of the `element`
interpolation function. List notation will go out of range, but by design
`element` will wrap.

## v0.1.1

Fixed the subnets so that they depend on the NAT gateway routes if they have
been requested. This fixes a race condition where the subnets may not be
routeable when they are expected to be. The subnet ID outputs now will block
until the NAT gateways are up, ensuring that modules that depend on the subnets
can safely assume that the routes are fully functional.

## v0.1.0

Initial release.
