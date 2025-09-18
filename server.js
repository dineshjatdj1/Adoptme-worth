const { google } = require("googleapis");
const fs = require("fs");
require("dotenv").config();

// Load service account JSON
const credentials = JSON.parse(fs.readFileSync("service-account.json"));
const clientEmail = credentials.client_email;
console.log("Service Account:", clientEmail);

// Auth
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

// Spreadsheet ID
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
console.log("Spreadsheet ID:", SPREADSHEET_ID);

// Helper function to fetch tab data
async function fetchTab(tabName) {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${tabName}!A2:Z`,
    });
    console.log(`✅ First rows from ${tabName} tab:`);
    console.log(res.data.values ? res.data.values.slice(0, 5) : "No data");
  } catch (err) {
    console.error(`❌ Error fetching ${tabName}:`, err.message);
  }
}

// Fetch all 4 tabs
async function testAll() {
  await fetchTab("Pets");
  await fetchTab("TradeExample");
  await fetchTab("Variants");
  await fetchTab("MarketReport");
}

testAll();
