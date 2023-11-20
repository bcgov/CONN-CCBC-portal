# CI/CD Pipeline

The CCBC Portal project contains a CI/CD pipeline for continuous integration and continuous deployment. It is all managed through GitHub Actions. It consists, of five jobs with multiple steps each:

- Build: builds the app containers (app, db, and cron-sp) using Docker and pushes them to the GitHub registry.
- Test code: static code analysis and security checks.
- Create release PR: creates a release PR on each merge to main. Intended to automate release tagging and deployment when necessary.
- Test Containers: Live tests against the app, which include e2e, screenshot, and security tests.
- Deploy: deploy the apps to OpenShift dev, test, and prod as needed using Helm.

## Build steps

### App

Builds the NextJS app for production use. Utilized docker buildx command along with the Dockerfile located under the app folder. It created an image ready to be run on OpenShift.

### DB

Created a DB image to be used by other GitHub Actions steps, it is not intended to be deployed onto OpenShift but just as a helper image for testing.

### Cron SP

Crates an image based on NodeJS to trigger the import endpoint of the APP for SharePoint data import. Image is build for OpenShift use.

## Test code steps

### Trivy scan code

Performs static code analysis using Aqua Trivy and publishes the result to the repository security tab.

### CodeQL Scan

Performs static code analysis using CodeQL (JS), against the PR (changed code) and creates alerts, warnings or security reports as appropriate.

### Cocogitto

Checks the commit follows conventional commit style.

### Gitleaks

Checks against potential leaks of sensitive or private information such as secrets, passwords, etc.

### Jest

Run all the tests created for the project using Jest and generates a report to be consumed by SonarCloud. A minimum of 80% coverage on new code is required before merging is enabled.

### Eslint

Ensures linting rules are being followed and generates warnings/errors as appropriate.

### Schema

Checks for inconsistencies between GraphQL Schema and the commit schema.

### Reverts

Ensures the DB sqitch schema is revertible.

### PGTap

Run database unit tests.

### Check Immutable Sqitch Files

Checks the sqitch file to be merged against the one on main and ensures the file is staying consistent/immutable.

### Check deleted sqitch tags

Checks for any previously existent sqitch tags that might have been deleted by mistake.

### Lint Chart

Performs linting on the Helm charts to be deployed into OpenShift.

## Create Release PR

Checks if a tag already exists and deletes and recreates as required, creates a release branch, closes any previous release PRs, creates a Sqitch tag, creates a release using `release-it`, and creates a PR for review and merging.

## Test containers

### E2E testing

Performs e2e testing using Cypress and Happo (for screenshots). Consists of four jobs, `yarn-test-e2e-applicant`, `yarn-test-e2e-admin`, `yarn-test-e2e-analyst` and `yarn-test-e2e-finalize`. The tests are separated by user for parallelization. The final step combines the screenshots using a nonce so they are bundled together for Happo.

### ZAP Owasp Full

Performs a full OWASP ZAP scan against the app built as part of the overall run. Will generate a report and create any issues as required.

### Trivy Scan App

Performs an Aqua Trivy image scan against the built app.

### Trivy Scan DB

Performs an Aqua Trivy image scan against the helper db image.

### Renovate

Runs the renovate bot for dependencies update PRs.

## Deploy

### Is Tagged Release

Checks if the current run is part of a GitHub Repository tag.

### Ensure Sqitch plan ends with tag

Checks if the current sqitch file ends with a tag.

### Deploy to OpenShift

Consists of three jobs for dev, test and prod. Each of them will login to the corresponding project and perform a helm deployment. Dev must succeed before test can run, and test must succeed before prod can run, in addition prod requires a manual approval for it's deployment.

### Export secrets

Exports the secrets into the Hashicorp Vault for encrypted storage and backup.
