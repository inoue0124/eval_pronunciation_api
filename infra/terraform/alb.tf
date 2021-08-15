resource "aws_lb" "alb" {
  name               = "eval-speech-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.api_http.id]
  subnets            = [aws_subnet.public_1.id, aws_subnet.public_2.id]

  tags = {
    Name = "eval-speech-alb"
  }
}

resource "aws_lb_target_group" "tg" {
  name     = "eval-speech-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
  health_check {
    path     = "/health"
    port     = 80
    protocol = "HTTP"
  }

  tags = {
    Name = "eval-speech-tg"
  }
}

resource "aws_lb_target_group_attachment" "tg-attachment-api" {
  target_group_arn = aws_lb_target_group.tg.arn
  target_id        = aws_instance.api.id
  port             = 80
}

resource "aws_lb_listener" "lb-listener" {
  load_balancer_arn = aws_lb.alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tg.arn
  }
}
