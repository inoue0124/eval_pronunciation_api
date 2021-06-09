resource "aws_db_subnet_group" "private_db" {
  name       = "private-db"
  subnet_ids = ["${aws_subnet.private_1.id}", "${aws_subnet.private_2.id}"]
  tags = {
    Name = "${var.prj_name}"
  }
}

resource "aws_db_instance" "db" {
  identifier             = "${var.prj_name}"
  allocated_storage      = 20
  storage_type           = "gp2"
  engine                 = "mysql"
  engine_version         = "5.7"
  instance_class         = "db.t3.micro"
  name                   = "mydb"
  username               = "foo"
  password               = "foobarbaz"
  parameter_group_name   = "default.mysql5.7"
  vpc_security_group_ids = ["${aws_security_group.db.id}"]
  db_subnet_group_name   = aws_db_subnet_group.private_db.name
  skip_final_snapshot    = true
}
