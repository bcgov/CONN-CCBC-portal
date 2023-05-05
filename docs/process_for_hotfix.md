# Publishing a Hotfix: Step-by-Step Guide

This guide outlines the process for publishing a hotfix, starting with receiving explicit instruction from the Product Owner (PO) via email.

## Step 1: Rebase Feature or Bugfix Branch off of the "hotfix" Branch

Once you receive explicit instruction from the PO to publish a hotfix, follow these steps:

1. Ensure you have the latest version of the "hotfix" branch. Run `git checkout hotfix && git pull`.
2. Checkout your feature or bugfix branch: `git checkout <your-feature-or-bugfix-branch>`.
3. Rebase your branch off of the "hotfix" branch: `git rebase hotfix`.
4. If conflicts occur during the rebase, resolve them and continue the rebase using `git rebase --continue`.
5. Push your rebased branch to the remote repository: `git push --force-with-lease`.

## Step 2: Create a Pull Request with the Merge Target as the "hotfix" Branch

1. Go to the GitHub repository and navigate to the "Pull requests" tab.
2. Click on the "New pull request" button.
3. In the "base" dropdown, select the "hotfix" branch.
4. In the "compare" dropdown, select your feature or bugfix branch.
5. Fill in the necessary information for the pull request (title, description, reviewers, etc.).
6. Click "Create pull request".

## Step 3: Review, Approve, and Merge the Pull Request

1. Have the assigned reviewers review your changes and provide feedback.
2. Address any necessary changes and update the pull request.
3. Once the pull request is approved, click "Merge pull request" and confirm the merge.
4. The CI/CD process will begin automatically once the pull request is merged.

## Step 4: Require Explicit Approval for Deploying to Production

Once the CI/CD is complete, go to [Deployments](https://github.com/bcgov/CONN-CCBC-portal/deployments) and you'll notice a pending deployment waiting for production. Approve and the fix/feature will be deployed.

## Step 5: Preserve the Branch and Rebase It Back onto `main`

1. After the hotfix has been deployed, ensure you have the latest version of the "main" branch: `git checkout main && git pull`.
2. Checkout your feature or bugfix branch again: `git checkout <your-feature-or-bugfix-branch>`.
3. Rebase your branch off of the "main" branch to include the hotfix in the main branch: `git rebase main`.
4. Resolve any conflicts that may occur during the rebase, and continue the rebase using `git rebase --continue`.
5. Push your updated branch to the remote repository: `git push --force-with-lease`.
6. Create a new pull request to merge your feature or bugfix branch back into the "main" branch.
