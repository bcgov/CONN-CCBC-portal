### Process to manipulate data in production

#### Important steps before you begin:

- Get request/approval from Product Owner
- Back up database before manipulating data
- Pair program with another developer

#### Manipulating the data

Don't start in `prod`, always start in the `dev` namespace to practice and mitigate the chance of a failure in prod.

1. Don't commit changes as superuser, change to the database user:

`set role ccbc;`

2. Always do the changes in a transaction:

`begin;`

<br />

3. Insert/update the data

4. If there was an error roll back the transaction:

`rollback;`

5. If the command was successful select the data and verify the data

6. If everything looks good commit the transaction:

`commit;`

7. If the data is testable in the app check and make sure everything is working as intended

8. Repeat the above steps in `test`

9. Message the product owner to verify the changes in test and give approval to update in prod.
