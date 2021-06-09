# 最新のgolden linux amiを取得
data "aws_ami" "api" {
  owners = ["self"]
  filter {
    name   = "name"
    values = ["${var.prj_name}_*"]
  }
  most_recent = true
}

# ec2
resource "aws_instance" "api" {
  ami                    = data.aws_ami.api.image_id
  subnet_id              = aws_subnet.public.id
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.api_http.id, aws_security_group.api_ssh.id]
  key_name               = aws_key_pair.ssh_key.id

  tags = {
    Name = "${var.prj_name}"
  }
}

# eip
resource "aws_eip" "api" {
  vpc = true

  tags = {
    Name = "${var.prj_name}-ec2"
  }
}

resource "aws_eip_association" "eip_assoc" {
  instance_id   = aws_instance.api.id
  allocation_id = aws_eip.api.id
}

# ssh key pair
resource "aws_key_pair" "ssh_key" {
  key_name   = "ssh_key"
  public_key = file("./key.pub")
}
