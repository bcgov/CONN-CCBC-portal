// Create an IAM role for the scanner lambda function
resource "aws_iam_role" "bucket-antivirus-scan" {
    name = "bucket-antivirus-scan"

    assume_role_policy = <<EOF
{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Action": "sts:AssumeRole",
          "Principal": {
            "Service": "lambda.amazonaws.com"
          },
          "Effect": "Allow",
          "Sid": ""
        }
      ]
}
EOF
}

// Create an IAM policy for the scanner lambda function
resource "aws_iam_policy" "bucket-antivirus-scan" {
    name        = "bucket-antivirus-scan"

    policy = <<EOF
{
   "Version":"2012-10-17",
   "Statement":[
      {
         "Effect":"Allow",
         "Action":[
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
         ],
         "Resource":"*"
      },
      {
         "Action":[
            "s3:*"
         ],
         "Effect":"Allow",
         "Resource":"*"
      }
   ]
}
EOF
}

// Bind the policy to the role
resource "aws_iam_role_policy_attachment" "attach-scan-role-policy" {
    role       = "${aws_iam_role.bucket-antivirus-scan.name}"
    policy_arn = "${aws_iam_policy.bucket-antivirus-scan.arn}"
}

// Add the lambda function
resource "aws_lambda_function" "scan-file" {
    filename         = "clamav-scanner.v1.0.0.zip"
    function_name    = "scan-bucket-file"
    role             = "${aws_iam_role.bucket-antivirus-scan.arn}"
    handler          = "scan.lambda_handler"
    source_code_hash = "${filebase64sha256("clamav-scanner.v1.0.0.zip")}"
    runtime          = "python3.7"
    timeout          = 300
    memory_size      = 1024

    environment {
        variables = {
        AV_DEFINITION_S3_BUCKET = "${aws_s3_bucket.clamav-definitions.bucket}"
        }
    }
}

// Allow the lambda function to access the S3 bucket
resource "aws_lambda_permission" "allow_terraform_bucket" {
    count = "${length(var.buckets-to-scan)}"
    statement_id = "AllowExecutionFromS3Bucket-${element(var.buckets-to-scan, count.index)}"
    action = "lambda:InvokeFunction"
    function_name = "${aws_lambda_function.scan-file.arn}"
    principal = "s3.amazonaws.com"
    source_arn = "arn:aws:s3:::${element(var.buckets-to-scan, count.index)}"
}

// Allow the S3 bucket to send notifications to the lambda function
resource "aws_s3_bucket_notification" "new-file-notification" {
    count = "${length(var.buckets-to-scan)}"
    bucket = "${element(var.buckets-to-scan, count.index)}"

    lambda_function {
        lambda_function_arn = "${aws_lambda_function.scan-file.arn}"
        events              = ["s3:ObjectCreated:*"]
    }
}

