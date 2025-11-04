
resource "aws_iam_role" "lambda_exec" {
  name = "lambda_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com",
      },
    }],
  })
}

resource "aws_iam_role_policy" "lambda_logs" {
  name = "lambda_logging"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      Resource = "arn:aws:logs:*:*:*",
      Effect = "Allow",
    }],
  })
}

resource "aws_lambda_function" "responsiveness_lambda" {
  function_name = "responsiveness_lambda_function"

  filename         = "responsiveness_lambda.zip"
  source_code_hash = filebase64sha256("responsiveness_lambda.zip")
  handler          = "check_responsiveness.lambda_handler"
  role             = aws_iam_role.lambda_exec.arn
  runtime          = "python3.10"
  timeout          = 30
}

resource "aws_sns_topic" "lambda_error_notifications" {
  name = "lambda-error-notifications"
}

resource "aws_sns_topic_subscription" "lambda_error_email" {
  for_each = toset(["rafael.solorzano@gov.bc.ca", "meherzad.romer@gov.bc.ca", "rumesha.ranathunga@gov.bc.ca", "nwbc.devinbox@gov.bc.ca"])
  topic_arn = aws_sns_topic.lambda_error_notifications.arn
  protocol  = "email"
  endpoint  = each.value
}

resource "aws_cloudwatch_metric_alarm" "lambda_error_alarm" {
  alarm_name          = "lambda-error-alarm"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = "60"
  statistic           = "Sum"
  threshold           = 0
  dimensions = {
    FunctionName = aws_lambda_function.responsiveness_lambda.function_name
  }
  alarm_actions = [aws_sns_topic.lambda_error_notifications.arn]
}

resource "aws_cloudwatch_event_rule" "lambda_schedule" {
  name                = "every-15-minutes"
  description         = "Trigger Lambda every 15 minutes"
  schedule_expression = "rate(15 minutes)"
}

resource "aws_cloudwatch_event_target" "invoke_lambda" {
  rule      = aws_cloudwatch_event_rule.lambda_schedule.name
  target_id = "TargetFunction"
  arn       = aws_lambda_function.responsiveness_lambda.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.responsiveness_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.lambda_schedule.arn
}
