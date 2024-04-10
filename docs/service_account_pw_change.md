# Changing Service Account Password Documentation

This document outlines the steps to change the password of the service account used in the CCBC Portal. Follow these instructions carefully to ensure a smooth transition to the new password.

## 1. Change Password

Access pwchange.gov.bc.ca (Gov access only). Generate a new password for the service account and save it.

## 2. Update Repository Secret on GitHub

1. Navigate to the GitHub repository.
2. Go to `Settings` tab.
3. Select `Secrets and Variables`, then `Actions`.
4. Under `Repository Secrets`, locate the variable named `SP_SA_PASSWORD`.
5. Update the value of `SP_SA_PASSWORD` to the new password set in step 1.
6. Save the changes.

## 3. Updating Password on OpenShift Deployment

### Option 1: Rerun Latest Deployment Processes

1. Access the deployment pipelines for dev, test, and prod environments.
2. Rerun the deployment processes for each environment.

**Note:** Ensure that the latest approved production deployment process is executed, not an older or not yet released/approved version.

### Option 2: Update Secrets on OpenShift Directly

Until a new release is deployed to each environment, the old secret will be used which will result in failed login attempts. To update the secrete directly:

1. Access the OpenShift console.
2. Update the environment variable for `SP_SA_PASSWORD` on the deployment configuration (`ccbc`) for each environment (dev, test, prod).
3. Save the changes.

**Note:** Ensure that all necessary approvals and checks are performed before deploying changes to production environments.
