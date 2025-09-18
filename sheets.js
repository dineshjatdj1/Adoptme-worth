const { google } = require('googleapis');

const SHEET_ID = process.env.GOOGLE_SHEETS_ID;
const RANGE = 'Pets!A2:E';

function authSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: './service-account.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });
  return google.sheets({ version: 'v4', auth });
}

async function getPets() {
  const sheets = authSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: RANGE
  });

  const rows = res.data.values;
  if (!rows) return [];

  return rows.map(r => ({
    name: r[0],
    rarity: r[1],
    type: r[2],
    neon: r[3],
    mega: r[4]
  }));
}

module.exports = { getPets };