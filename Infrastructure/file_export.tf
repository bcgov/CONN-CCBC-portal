// Create an IAM role for the export lambda function
resource "aws_iam_role" "bucket-export" {
    name = "bucket-export"

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

// Create an IAM policy for the export lambda function
resource "aws_iam_policy" "bucket-export" {
    name        = "bucket-export"

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
resource "aws_iam_role_policy_attachment" "attach-export-role-policy" {
    role       = "${aws_iam_role.bucket-export.name}"
    policy_arn = "${aws_iam_policy.bucket-export.arn}"
}

// Add the lambda function
resource "aws_lambda_function" "export-files" {
    filename         = "arc_lambda.zip"
    function_name    = "export-bucket-files"

    role             = "${aws_iam_role.bucket-export.arn}"
    handler          = "index.handler"
    source_code_hash = "${filebase64sha256("arc_lambda.zip")}"
    runtime          = "nodejs16.x"
    timeout          = 300
    memory_size      = 2048
    ephemeral_storage {
      size = 2048 # Min 512 MB and the Max 10240 MB
    }

    environment {
        variables = {
          AWS_S3_TARGET = "${var.bucket_name}"
          AWS_S3_BUCKET = "${var.clamav-definitions-bucket}" 
        }
    }
}

// Allow the lambda function to access the S3 bucket
resource "aws_lambda_permission" "allow_data_bucket" {
    statement_id = "AllowExecutionFromS3Bucket-${var.clamav-definitions-bucket}"
    action = "lambda:InvokeFunction"
    function_name = "${aws_lambda_function.export-files.arn}"
    principal = "s3.amazonaws.com"
    source_arn = "arn:aws:s3:::${var.clamav-definitions-bucket}"
}

// Allow the S3 bucket to send notifications to the lambda function
resource "aws_s3_bucket_notification" "file-notification" {
    count = 1
    bucket = "${var.clamav-definitions-bucket}"

    lambda_function {
        lambda_function_arn = "${aws_lambda_function.export-files.arn}"
        events              = ["s3:ObjectCreated:*"]
    }
}
