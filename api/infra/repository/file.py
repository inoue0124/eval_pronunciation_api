from api.util.config import S3_BUCKET_NAME
import shutil


class FileRepository:
    def __init__(self, s3_client):
        self.s3_client = s3_client

    def download(self, object_key, dest_file: str):
        self.s3_client.download_file(S3_BUCKET_NAME, object_key, dest_file)

    def create_zip(self, zipfile_name: str, src_dir: str):
        shutil.make_archive(zipfile_name, 'zip', root_dir=src_dir)
