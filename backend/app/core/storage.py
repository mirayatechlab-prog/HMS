"""Private S3-compatible object storage abstraction."""

from typing import Protocol

import boto3
from botocore.client import BaseClient
from botocore.config import Config


class ObjectStorageClient(Protocol):
    """Abstract interface for private document/report storage."""

    def generate_presigned_download_url(self, object_key: str, expires_in: int = 300) -> str:
        """Generate a short-lived presigned download URL for an authorized object."""
        ...


class S3ObjectStorageClient:
    """S3-compatible (MinIO/AWS S3) private object storage client."""

    def __init__(
        self,
        endpoint_url: str,
        access_key_id: str,
        secret_access_key: str,
        bucket_name: str,
        region_name: str = "ap-south-1",
    ) -> None:
        self.bucket_name = bucket_name
        self._client: BaseClient = boto3.client(
            "s3",
            endpoint_url=endpoint_url,
            aws_access_key_id=access_key_id,
            aws_secret_access_key=secret_access_key,
            region_name=region_name,
            config=Config(signature_version="s3v4"),
        )

    def generate_presigned_download_url(self, object_key: str, expires_in: int = 300) -> str:
        """Generate a short-lived presigned GET URL; never expose public bucket URLs."""
        url: str = self._client.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket_name, "Key": object_key},
            ExpiresIn=expires_in,
        )
        return url
