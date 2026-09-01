import https from 'https';

console.log('Node version:', process.version);

const req = https.request('https://ac01b620e80481543c38f2f0bc27101f.r2.cloudflarestorage.com', (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Headers:', res.headers);
});

req.on('error', (e) => {
  console.error('HTTPS Error:', e);
});

req.end();
