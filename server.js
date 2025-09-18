const express = require("express");
const { google } = require("googleapis");

const app = express();
const PORT = process.env.PORT || 3000;

// Auth setup
let credentials;
try {
  credentials = JSON.parse(
    Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64, "base64").toString()
  );
} catch (err) {
  console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON_B64:", err.message);
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

// Root test route
app.get("/", (req, res) => {
  res.send("Adopt Me API is running 🚀");
});

// Test Sheets route
app.get("/api/pets", async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Pets!A2:Z", // just the Pets tab
    });

    res.json({ pets: response.data.values });
  } catch (error) {
    console.error("Error fetching sheet:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
