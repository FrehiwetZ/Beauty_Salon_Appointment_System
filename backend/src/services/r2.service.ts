import dotenv from 'dotenv';
dotenv.config();

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import https from 'https';
import path from 'path';

let r2Client: S3Client | null = null;

function getR2Client(): S3Client {
  if (!r2Client) {
    const endpoint = process.env.R2_ENDPOINT || (process.env.CLOUDFLARE_ACCOUNT_ID ? `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com` : undefined);
    r2Client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
      requestHandler: new NodeHttpHandler({
        httpsAgent: new https.Agent({
          keepAlive: true,
          maxSockets: 50,
          rejectUnauthorized: true,
        }),
      }),
    });
  }
  return r2Client;
}

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'beauty-salon-image-source';
const PUBLIC_BASE_URL = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');

const MIME_MAP: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.bmp': 'image/bmp',
  '.ico': 'image/x-icon',
  '.avif': 'image/avif',
};

export interface UploadResult {
  url: string;
  key: string;
  bucket: string;
  contentType: string;
  size: number;
}

/**
 * Upload an image buffer directly to Cloudflare R2 bucket
 */
export async function uploadToR2(
  fileBuffer: Buffer,
  originalFileName: string,
  folder: string = 'uploads'
): Promise<UploadResult> {
  const ext = (path.extname(originalFileName) || '.png').toLowerCase();
  const rawBaseName = path.basename(originalFileName, ext);
  const sanitizedBaseName = rawBaseName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanFolder = (folder || 'uploads').replace(/^\/+|\/+$/g, '');
  const uniqueKey = `${cleanFolder}/${sanitizedBaseName}_${Date.now()}${ext}`;

  const contentType = MIME_MAP[ext] || 'image/jpeg';

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: uniqueKey,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await getR2Client().send(command);

  const publicUrl = PUBLIC_BASE_URL
    ? `${PUBLIC_BASE_URL}/${uniqueKey}`
    : `${process.env.R2_ENDPOINT}/${BUCKET_NAME}/${uniqueKey}`;

  return {
    url: publicUrl,
    key: uniqueKey,
    bucket: BUCKET_NAME,
    contentType,
    size: fileBuffer.length,
  };
}
