// Bucket to hold clamav definitions
resource "aws_s3_bucket" "clamav-definitions" {
    bucket = "${var.clamav-definitions-bucket}" 
}

resource "aws_iam_role" "clamav" {
    name = "clamav"

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

resource "aws_iam_policy" "clamav" {
    name = "clamav"

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
            "s3:GetObject",
            "s3:GetObjectTagging",
            "s3:PutObject",
            "s3:PutObjectTagging",
            "s3:PutObjectVersionTagging"
         ],
         "Effect":"Allow",
         "Resource":"arn:aws:s3:::${aws_s3_bucket.clamav-definitions.bucket}/*"
      },
      {
          "Effect": "Allow",
          "Action": "sns:*",
          "Resource": "arn:aws:sns:*:${data.aws_caller_identity.current.account_id}:${var.sns-name}"
      }
   ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "clamav" {
    role       = "${aws_iam_role.clamav.name}"
    policy_arn = "${aws_iam_policy.clamav.arn}"
}

resource "aws_lambda_function" "update-clamav-definitions" {
    filename         = "clamav_lambda.zip"
    function_name    = "update-clamav-definitions"
    layers = [
      module.lambda_layer_s3.lambda_layer_arn,
    ]
    role             = "${aws_iam_role.clamav.arn}"
    handler          = "index.updateDb"
    source_code_hash = "${filebase64sha256("clamav_lambda.zip")}"
    runtime          = "nodejs16.x"
    timeout          = 300
    memory_size      = 2048
    ephemeral_storage {
      size = 2048 # Min 512 MB and the Max 10240 MB
    }

    environment {
        variables = {
            AV_DEFINITION_S3_BUCKET = "${aws_s3_bucket.clamav-definitions.bucket}",
            AV_NOTIFICATION_TOPIC = "${aws_sns_topic.notification_sns_topic.arn}"
        }
    }
}

// Cloudwatch event that fires every day
resource "aws_cloudwatch_event_rule" "every-day" {
    name                = "every-day"
    description         = "Fires once a day"
    schedule_expression = "cron(0 12 * * ? *)"
}

// A rule to call a lambda function when the Cloudwatch event fires
resource "aws_cloudwatch_event_target" "update-clamav-definitions" {
    rule      = "${aws_cloudwatch_event_rule.every-day.name}"
    target_id = "update-clamav-definitions"
    arn       = "${aws_lambda_function.update-clamav-definitions.arn}"
}

// Permissions to allow the Cloudwatch event to call our Lambda function
resource "aws_lambda_permission" "allow_cloudwatch_to_update_antivirus" {
    statement_id  = "AllowExecutionFromCloudWatch"
    action        = "lambda:InvokeFunction"
    function_name = "${aws_lambda_function.update-clamav-definitions.function_name}"
    principal  = "events.amazonaws.com"
    source_arn = "${aws_cloudwatch_event_rule.every-day.arn}"
}

