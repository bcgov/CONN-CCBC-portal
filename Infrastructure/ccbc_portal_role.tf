// Create an IAM role for ccbc-portal
resource "aws_iam_role" "ccbc-portal-role" {
    name = "ccbc-portal-role"

    assume_role_policy = <<EOF
{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Action": "sts:AssumeRole",
          "Principal": {
            "AWS": "arn:aws:iam::${data.aws_caller_identity.current.account_id}:user/ccbc-portal"
          },
          "Effect": "Allow",
          "Sid": ""
        }
      ]
}
EOF
}

// Attach the AWS managed policy AmazonS3FullAccess to the role
resource "aws_iam_role_policy_attachment" "attach-s3-full-access" {
    role       = "${aws_iam_role.ccbc-portal-role.name}"
    policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}
