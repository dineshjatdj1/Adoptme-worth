const express = require('express');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const { getPets } = require('./sheets');
const app = express();

if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64) {
  const path = './service-account.json';
  if (!fs.existsSync(path)) {
    fs.writeFileSync(
      path,
      Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64, 'base64').toString('utf8')
    );
    console.log('✅ service-account.json written from env');
  }
}

const allowedOrigins = [
  'http://localhost:3000',
  'https://phpstack-1507935-5860673.cloudwaysapps.com/'
];
app.use(cors()));


app.get('/api/pets', async (req, res) => {
  try {
    const pets = await getPets();
    res.json(pets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch pets' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on ${PORT}`));