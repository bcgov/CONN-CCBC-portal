# Offboarding Process

This document outlines the steps to be followed when offboarding an employee from their technical access within the organization. It covers removing access from Sysdig, OpenShift roles, GitHub Teams, and AWS environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Removing User from Sysdig](#removing-user-from-sysdig)
- [Revoking OpenShift Roles](#revoking-openshift-roles)
- [Removing User from GitHub Team](#removing-user-from-github-team)
- [Requesting AWS Access Removal](#requesting-aws-access-removal)
- [Confirmation and Documentation](#confirmation-and-documentation)

## Prerequisites

- Administrator access to Sysdig, OpenShift, GitHub, and email system.
- List of all systems the employee has access to.
- Offboarding request form or ticket completed by the employee's manager.

## Removing User from Sysdig

1. Go to the `sysdigteam.yaml` file
2. Remove both the name and email of the user that is no longer available

## Revoking OpenShift Roles

1. Go to our openshift platform
2. Make sure you're in the "Administrator" view
3. Under "User Management" select "RoleBindings"
4. Delete users who have been removed from the team in all environments

## Removing User from GitHub Team

1. All users should be managed on the [CITZ team](https://github.com/orgs/bcgov/teams/citz-connectivity) github
2. Ensure that the team member has transferred ownership of any private repostories that they own to another member. These will be deleted once they are no longer part of this team.
3. Remove any members of the team that are no longer contracted to work on the project.

## Requesting AWS Access Removal

This must be done by BC Gov's AWS Team. It is tied to IDIR, so once that access is revoked this should propagate. However it may still be important to revoke access at an earlier time.

1. Send an e-mail to the PO referencing exactly which IDIRs have been removed from the project, so they can forward/inform the AWS BCGov team.
