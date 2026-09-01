import dotenv from 'dotenv';
dotenv.config();

import { uploadToR2 } from './services/r2.service';

async function testR2() {
  console.log('Testing Cloudflare R2 upload...');
  console.log('Bucket:', process.env.R2_BUCKET_NAME);
  console.log('Endpoint:', process.env.R2_ENDPOINT);
  console.log('Public URL:', process.env.R2_PUBLIC_URL);

  // 1x1 transparent PNG pixel buffer
  const samplePngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
  const buffer = Buffer.from(samplePngBase64, 'base64');

  try {
    const res = await uploadToR2(buffer, 'test_pixel.png', 'test');
    console.log('Upload SUCCESSFUL!');
    console.log('Result:', JSON.stringify(res, null, 2));
  } catch (err: any) {
    console.error('Upload FAILED:', err);
  }
}

testR2();
