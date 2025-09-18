const express = require("express");
const { google } = require("googleapis");

const app = express();
const PORT = process.env.PORT || 10000;

// Decode Base64 service account JSON
let credentials;
try {
  credentials = JSON.parse(
    Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64, "base64").toString()
  );
} catch (err) {
  console.error("❌ Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON_B64:", err.message);
}

// Auth setup
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

// Spreadsheet ID
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
if (!SPREADSHEET_ID) console.error("❌ SPREADSHEET_ID is not set");

// Root route
app.get("/", (req, res) => {
  res.send("<h1>Adopt Me Pet Value API 🚀</h1><p>Try /api/pets</p>");
});

// Helper function to fetch tab
async function fetchTab(tabName) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${tabName}!A2:Z`,
    });
    return response.data.values || [];
  } catch (err) {
    console.error(`❌ Error fetching ${tabName}:`, err.message);
    return { error: err.message };
  }
}

// API endpoints
app.get("/api/pets", async (req, res) => {
  const data = await fetchTab("Pets");
  res.json(data);
});

app.get("/api/trades", async (req, res) => {
  const data = await fetchTab("TradeExample");
  res.json(data);
});

app.get("/api/variants", async (req, res) => {
  const data = await fetchTab("Variants");
  res.json(data);
});

app.get("/api/market", async (req, res) => {
  const data = await fetchTab("MarketReport");
  res.json(data);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
