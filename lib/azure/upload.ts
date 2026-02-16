import { BlobServiceClient } from "@azure/storage-blob";
import { AzureNamedKeyCredential } from "@azure/core-auth";


const imagesContainerName = process.env.AZURE_STORAGE_CONTAINER_IMAGES!;
const resumeContainerName = process.env.AZURE_STORAGE_CONTAINER_RESUMES!;

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING!
);

export const uploadImagesToAzure = async (file: Buffer, fileName: string, mime: string) => {
  const containerClient = blobServiceClient.getContainerClient(imagesContainerName);
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  await blockBlobClient.uploadData(file, {
    blobHTTPHeaders: { blobContentType: mime }
  });

  return blockBlobClient.url;
};

export const uploadResumeToAzure = async (file: Buffer, fileName: string, mime: string) => {
  const containerClient = blobServiceClient.getContainerClient(resumeContainerName);
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  await blockBlobClient.uploadData(file, {
    blobHTTPHeaders: { blobContentType: mime }
  });

  return blockBlobClient.url;
};


