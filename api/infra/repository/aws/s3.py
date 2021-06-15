from api.util.config import AWS_ACCESS_KEY, AWS_REGION, AWS_SECRET_KEY
import boto3
from boto3.session import Session

s3_client = Session(aws_access_key_id=AWS_ACCESS_KEY,
                    aws_secret_access_key=AWS_SECRET_KEY,
                    region_name=AWS_REGION).client('s3')
