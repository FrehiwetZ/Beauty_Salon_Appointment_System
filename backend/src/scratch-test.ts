import dotenv from 'dotenv';
dotenv.config();

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import https from 'https';
import { NodeHttpHandler } from '@smithy/node-http-handler';

async function testOptions() {
  const agent = new https.Agent({
    keepAlive: true,
    maxSockets: 50,
    rejectUnauthorized: true,
  });

  const client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT || `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
    requestHandler: new NodeHttpHandler({
      httpsAgent: agent,
    }),
  });

  const samplePngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
  const buffer = Buffer.from(samplePngBase64, 'base64');

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || 'beauty-salon-image-source',
      Key: 'test/pixel.png',
      Body: buffer,
      ContentType: 'image/png',
    });

    const res = await client.send(command);
    console.log('SUCCESS PutObject with NodeHttpHandler:', res);
  } catch (err: any) {
    console.error('FAILED:', err);
  }
}

testOptions();
