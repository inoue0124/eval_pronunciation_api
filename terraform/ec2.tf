# 最新のamazon linux amiを取得
data "aws_ssm_parameter" "amzn2_ami" {
  name = "/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2"
}

# ec2
resource "aws_instance" "api" {
  ami                    = data.aws_ssm_parameter.amzn2_ami.value
  subnet_id              = aws_subnet.sn_public.id
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.api_http.id]
  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Name = "${var.prj_name}"
  }
}

# eip
resource "aws_eip" "api" {
  vpc = true
  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Name = "${var.prj_name}-ec2"
  }
}

resource "aws_eip_association" "eip_assoc" {
  instance_id   = aws_instance.api.id
  allocation_id = aws_eip.api.id
}
