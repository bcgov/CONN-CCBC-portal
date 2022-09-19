### Process to manipulate data in production

To manipulate data in production, the default workflow is to create a `sqitch` change, associated with `pgTap` tests that are run in our CI pipeline and tested in our `dev` and `test` environments as the application is deployed.

In rare cases, the team needs to manipulate data directly in the database, without going through our usual guardrails. Examples of this are mostly around manipulation of private data. This repository is open-source, therefore we should not commit any private information.

This should be considered a last resort. Updating data in production could lead to cascading failure if done without the proper guardrails, which our CI are providing.
#### Important steps before you begin:

- Get an email request from Product Owner, including a date request for the changes
- Post a message in the team's channel to find an other developer who is available to pair with you to make the change.
- Respond to the email request, ensuring that the work will not be done by multiple devs concurrently
- Start a meeting, sharing your screen with the other developer the entire time
- Back up database before manipulating data (add link to manual backup instructions here)

#### Manipulating the data

Don't start in `prod`, always start in the `dev` namespace to practice and mitigate the chance of a failure in prod.

0. Read through the steps below before starting.

1. Don't commit changes as superuser, change to the database user:

`set role ccbc;`

2. Always do the changes in a transaction:

`begin;`

At this point, you should see the following `psql` prompt: `ccbc=*>`. The `*` indicates that you are in a transaction, and the `>` is the normal user prompt (instead of `#` for a superuser)
<br />

3. Insert/update the data

4. If there was an error roll back the transaction:

`rollback;`

5. If the command was successful select the data and verify the data

6. If everything looks good to you and the other developer(s) on the call, commit the transaction:

`commit;`

7. If the data is testable in the app check and make sure everything is working as intended

8. Repeat the above steps in `test`

9. Message the product owner to verify the changes in test and give approval to update in prod.
