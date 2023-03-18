# The configuration for the `remote` backend.
terraform {
  backend "remote" {
    # The name of your Terraform Cloud organization.
    organization = "chatgpt"

    # The name of the Terraform Cloud workspace to store Terraform state files in.
    workspaces {
      name = "chatgpt-personal-assistant"
    }
  }
}

# An example resource that does nothing.
resource "aws_instance" "web" {
  ami           = "ami-a1b2c3d4"
  instance_type = "t2.micro"
}

