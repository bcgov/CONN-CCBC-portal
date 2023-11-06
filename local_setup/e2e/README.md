# How to use?

The script included provides two ways to run it, against a local development environment running using `yarn dev` or against a built image.

To use against a local development environment set the variable `USE_LOCAL` to `Y`, otherwise set the variable `SHA` to the SHA of the image you want use from the GitHub repo registry.

Then run:

`./run_e2e_tests.sh`

# Prerequisites

If running in a local development environment, it is assumed node and the repository dependencies have been installed. A temporary db used for e2e will be deployed and then destroyed, please stop your development DB before running the script.
