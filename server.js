const express = require("express");
const { google } = require("googleapis");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Auth
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(
    Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64, "base64").toString()
  ),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});


const sheets = google.sheets({ version: "v4", auth });

// Helper function to fetch tab data
async function getSheetData(tabName, range = "A2:Z") {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: `${tabName}!${range}`,
  });
  return res.data.values || [];
}

// Routes
app.get("/api/pets", async (req, res) => {
  try {
    const pets = await getSheetData("Pets");
    res.json({ pets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/trades", async (req, res) => {
  try {
    const trades = await getSheetData("TradeExample");
    res.json({ trades });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/variants", async (req, res) => {
  try {
    const variants = await getSheetData("Variants");
    res.json({ variants });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/market", async (req, res) => {
  try {
    const market = await getSheetData("MarketReport");
    res.json({ market });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.get("/", (req, res) => {
  res.send("<h1>Adopt Me Pet Value API is running 🚀</h1><p>Try <a href='/api/pets'>/api/pets</a></p>");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
