#### k6 Load testing

**IMPORTANT**: Before running load tests notify platform services. It's okay to test that any script modifications are working with a small amount of virtual users though we should notify them when we are running heavy tests.

The upload tests use a large amount of RAM and are fairly CPU heavy. If you are memory constrained the small upload test should run with 16gb RAM. Close external applications and unused browser tabs if necessary or ideally run from a system with more memory or a virtual machine instance.

###### Steps to run loads tests

1. Install k6 - https://k6.io/docs/get-started/installation/

2. Make `k6Results` folder in project root

3. If you are running the file uploads tests run the command `make generate_perf_files` in the project root directory.

4. Choose which test you are going to run in `/app/tests/perf/script.js`.

5. Test it is working correctly by running tests against your local dev server running at `http://localhost:3000/`.

6. Deploy application to dev in load testing mode. You can deploy using `deploy_load_test.yaml` which has the env var `enable_load_test` set to `true`.

7. Change variable `APP_HOST` value to the route being tested eg: `https://dev.connectingcommunitiesbc.ca/`

8. Run `make perf_test`

9. Monitor deployment

10. Results will be in k6Results folder
