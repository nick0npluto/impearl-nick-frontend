const https = require('https');

const data = JSON.stringify({
  email: 'test@example.com',
  password: 'secret',
  userType: 'business'
});

const req = https.request(
  'https://nameless-ravine-39675-e2daa069c3db.herokuapp.com/api/auth/register',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  },
  (res) => {
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Body:', body.slice(0, 200));
    });
  }
);

req.on('error', (err) => {
  console.error('Error:', err.message);
});

req.write(data);
req.end();
