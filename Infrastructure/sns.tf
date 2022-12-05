resource "aws_sns_topic" "notification_sns_topic" {
  name = var.sns-name
}

resource "aws_sns_topic_policy" "notification_topic_policy" {
  arn = aws_sns_topic.notification_sns_topic.arn
  policy = data.aws_iam_policy_document.notification_sns_policy_document.json
}

data "aws_iam_policy_document" "notification_sns_policy_document" {
  policy_id = "__default_policy_ID"

  statement {
    actions = [
      "SNS:Subscribe",
      "SNS:SetTopicAttributes",
      "SNS:RemovePermission",
      "SNS:Receive",
      "SNS:Publish",
      "SNS:ListSubscriptionsByTopic",
      "SNS:GetTopicAttributes",
      "SNS:DeleteTopic",
      "SNS:AddPermission",
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceOwner"

      values = [
        data.aws_caller_identity.current.account_id,
      ]
    }

    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    resources = [
      aws_sns_topic.notification_sns_topic.arn,
    ]

    sid = "__default_statement_ID"
  }
}