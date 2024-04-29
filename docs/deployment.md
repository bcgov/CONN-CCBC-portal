# Feature Deployment Process Documentation

## Overview

This document outlines the Continuous Integration and Continuous Deployment (CI/CD) process for managing feature environments, code review, approval, and release processes.

## Development Process/PR Process

1. **PR Creation and Drafting:**
   - When a Pull Request (PR) is created, it starts as a draft.
2. **Ready for Review:**
   - Once the PR is toggled to "ready for review", the following will happen:
     - a. A new database is created with the branch name as the database name, and the test database is copied over to the new database. Database creation is handled by the PG operator, and the copy operation is performed by an Openshift job using psql with the test namespace as the source.
     - b. The application is deployed with the new feature using Helm, using the branch name as the Helm release name (truncated to 40 characters.)
     - c. With each subsequent change, the database is reset, and the Helm release is updated to the new version.
3. **PR Closure:**
   - If the PR is toggled back to draft or gets merged:
     - a. The feature database is dropped and removed, and the Helm release is uninstalled.

## Approval Process

1. **Developer Approval:**
   - One developer approval is required before merge can occur.
2. **Notification to PO:**
   - Once a developer approves a PR, the Product Owner (PO) is notified:
     - a. A comment is created on the related JIRA ticket with the feature environment.
     - b. The issue is transitioned to "PO Review" status, triggering JIRA Automation that emails the PO with a direct link to the issue.
3. **PO Approval:**
   - If the PO approves, the developer is notified to start the merge/release process. Otherwise, the PR needs to be marked as draft by the developer.

## Code Merge/Release Process

1. **Tag and Release Creation:**
   - After PO approval, a tag and release are automatically created by GitHub Actions upon checking the box "Check me to trigger release process." on the PR description. Alternatively, it can be performed by running `make release`.
2. **Checks:**
   - Multiple checks are performed as part of the above step, including checks for duplicate tags, approvals, and ensuring the PR is up to date with the main branch.
3. **Merge and Deployment:**
   - If all checks pass, the PR can be safely merged, and it will automatically be deployed to the test and then production environments.

## Diagram

For a detailed diagram of the process please refer to the live miro diagram [here](https://miro.com/app/board/uXjVNkUAjsA=/).

## Conclusion

This CI/CD process streamlines development, code review, approval, and release processes, ensuring efficient and reliable feature deployment while maintaining quality and consistency.
