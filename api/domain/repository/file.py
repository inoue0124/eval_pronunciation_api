from typing import Protocol, runtime_checkable


@runtime_checkable
class FileRepository(Protocol):
    def __init__(self, db, s3_client):
        ...

    def download(self, object_key, dest_file: str):
        ...

    def create_zip(self, zipfile_name: str, src_dir: str):
        ...