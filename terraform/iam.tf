# AWS Academy Learner Lab provides a pre-existing "LabRole" with broad permissions.
# Students do not have permissions to create custom IAM roles or policies (IAM:CreateRole is denied).
# We must fetch and use this LabRole for all our AWS services.

data "aws_iam_role" "lab_role" {
  name = "LabRole"
}
