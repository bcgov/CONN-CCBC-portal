# End-To-End Tests

The script included provides two ways to run it, 
against a local development environment running 
using `yarn dev` or against a built image.

## Prerequisites

If running in a local development environment, it is assumed 
node and the repository dependencies have been installed. 
A temporary db used for e2e will be deployed and then destroyed, 
please stop your development DB before running the script.

## Running the tests

### 1. Setup Environment variables
#### 1.1. For local environment

```shell
export USE_LOCAL=Y
```

#### 1.2. For all other environments
```shell
# SHA of the image you want use from the GitHub repo registry
export SHA=<sha>
```

### 2. Run the tests

```shell
./run_e2e_tests.sh
```
