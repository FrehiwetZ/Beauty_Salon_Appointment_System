import dotenv from 'dotenv';
dotenv.config();

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
});

// Add middleware to log the URL
client.middlewareStack.add(
  (next) => async (args) => {
    const request = args.request as any;
    console.log('Outgoing Request URL:', request.protocol + '//' + request.hostname + request.path);
    console.log('Request Headers:', request.headers);
    return next(args);
  },
  { step: 'finalizeRequest' }
);

async function run() {
  try {
    const cmd = new PutObjectCommand({
      Bucket: 'beauty-salon-image-source',
      Key: 'test/pixel.png',
      Body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64'),
      ContentType: 'image/png',
    });
    const res = await client.send(cmd);
    console.log('SUCCESS! PutObject response:', res);
  } catch (err: any) {
    console.error('ERROR:', err);
  }
}

run();
