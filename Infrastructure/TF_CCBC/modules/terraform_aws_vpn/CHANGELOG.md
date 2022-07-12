## 0.2.2-pre

Bumped version for dev.

## 0.2.1

This update adds the `existing_vpn_gateway_id` flag, which allows you to supply
a pre-existing AWS VPN gateway ID that will become the VPN gateway that is used
for this connection and remote networks. AWS only allows one VPN gateway
attached to a VPC at any given time.

## 0.2.0

Added support for multiple VPN endpoints. This will now allow you to create a
VPN that should tunnel to multiple endpoints.

## 0.1.1

This is a bugfix release to fix a syntax issue in one of the created `aws_route`
resources that was a relic of the refactoring of the module.

## 0.1.0

Initial release.
