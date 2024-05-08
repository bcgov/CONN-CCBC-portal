# Responsiveness Lambda Documentation

## Installation

To set up the environment for the `check_responsiveness.py` file, follow these steps:

1. Create and activate a virtual environment using `venv`:

```bash
cd Infrastructure/responsiveness_lambda
python3 -m venv venv
source venv/bin/activate
```

2. Install sources

Install the dependencies from `requirements.txt`:

```bash
pip install -r requirements.txt
```

Deactivate the venv using

```bash
deactivate
```

3. Create the deployment package

Navigate to the `site-packages` directory to prepare the package:

```bash
cd ${work_dir}/Infrastructure/responsiveness_lambda/responsiveness_lambda/venv/lib/python3.x/site-packages
```

Replacing `python3.x` with the version of python you're using (should be consistent with the version listed in `.tool-versions` file)

Create a zip with the packages:

```bash
zip -r9 ${work_dir}/Infrastructure/responsiveness_lambda/responsiveness_lambda/responsiveness_lambda.zip .
```

This zips all the packages together, leaving it in the root as required by AWS Lambda

We still must add in the python code to the zip file, navigate back to the `responsiveness_lambda` folder where both the python code and zip file has been generated. Additionally, we will be appending the python folder to the zip file.

```bash
cd ${work_dir}/Infrastructure/responsiveness_lambda
zip -g responsiveness_lambda.zip check_responsiveness.py
```

Finally, the terraform code expects the zip to be in the root `Infrastructure` directory

```bash
mv ${workdir}/Infrastructure/responsiveness_lambda/responsiveness_lambda.zip ${workdir}/Infrastructure/responsiveness_lambda.zip
```

Any changes made to the zip or python file will be picked up by terraform.

4. Deploying the changes

After adding your credentials to your terminal, a simple `terraform plan` and `terraform apply` in the `Infrastructure` directory should create the necessary AWS resources.
