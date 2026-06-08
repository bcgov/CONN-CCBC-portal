# Portal Outage Troubleshooting Guide

This guide documents the steps taken to troubleshoot during portal outage tracked in NDT-1212, but is intended as a reusable troubleshooting flow for future outages.

## Step 1: Confirm Portal Impact

1. Try the portal in a normal browser.
2. Try a private browser session.
3. Try a login-protected page if login is available.
4. Try `Test` or `Dev(Feature)` instances.
5. Check whether the issue affects all users or only some users.
6. Check whether the issue affects all pages or only logged-in pages.

## Initial Triage

1. Confirm whether the responsiveness Lambda is failing.
2. Check pod status and confirm the application pods are `Running`.
3. Check app logs for startup errors, connection errors or repeated failures. Then load the portal and watch for the incoming request log, usually the line that includes the IP address. If that request log does not appear, the request may not be reaching the app, so DNS, route, service issues should be checked first.
4. Check other environments like `Test` and `Dev(Feature)`.
5. Check for `Platform Services` `sso` announcements or channels to see ongoing issues affecting broader set of applications/teams
6. Check for a recent triggers like a cron job, restart, deployment, OpenShift upgrade, secret change etc.

Possible outcomes:

- Immediate browser error: likely DNS, route or service issue.
- Page loads forever: likely application, GraphQL, or database etc.
- Error page from the app: likely application code related or data issue.

## Step 2: Check Whether Traffic Reaches The Application

Look for incoming request logs in the application pod.

If request logs appear when the page is loaded, traffic is reaching the application.

If request logs do not appear, check:

- DNS or vanity URL configuration.
- Whether the same issue happens through the default `.apps.silver.devops.gov.bc.ca` route.

If both the vanity URL and the default OpenShift route fail the same way, DNS is less likely to be the root cause.

## Step 3: Check Whether The Application Responds Slowly

If requests reach the application but the page keeps loading, determine whether the app never responds or responds after a long delay.

Useful checks:

- Check whether the same request eventually returns after a long wait.
- You can temporarily increase route timeout(to 9999s) if needed.

If the application eventually responds after a long delay, focus on what the server is waiting for.

## Step 4: Simplify Application Logs

- If multiple pods are running and logs are hard to follow, temporarily scale the application down to one pod.
- Once verbose logs are implemented as suggested, enable through env var. (or use a new image with extra logs added [PR created during the troubleshooting](https://github.com/bcgov/CONN-CCBC-portal/pull/4462))

## Step 5: Rule Out External Services

External services may cause slow loading or failed startup. Check them too.

- GrowthBook
- CHES
- AWS (the server won’t start with wrong AWS keys)

## Step 6: Check Environments

1. If other environments are fine - try restarting them to see if the same issue triggers.
2. Try same image in another environment.
3. A dev image in the failing (Prod) environment to see if the build was the issue.
4. Temporary copy of the failing deployment with its own route and service.
5. Test deployment running in the production environment.
6. Same deployment pointed at a different database.

And,

- If the same image works elsewhere, the build is less likely to be the cause.
- If a known working image fails in the same environment, the environment is more suspicious.

## Step 7: Check Database

1. Pod status.
2. Run effected Database copy locally.
3. Point effected environment to another environment's database. (This was the case in this scenario)
4. Suspicious DB connection is usually resolves via a server restart.
5. An image that logs every single connection the server makes, growthbook, graphql, postraphile, relay, fetches, anything going out of the server during ssr.
6. Confirm whether a full GraphQL request completes

## Step 8: If Database is the culprit

1. Restart replicas before touching the primary where possible.
2. Perform a forced failover to one of the freshly restarted replicas.
3. Perform a Helm redeployment to restore normal prod config.
4. Restart the former primary

## Step 9: Re-test

Restest application throughout the process until back online.
