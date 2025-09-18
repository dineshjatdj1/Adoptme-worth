const { google } = require("googleapis");
const fs = require("fs");

// Load service account JSON directly
const credentials = JSON.parse(fs.readFileSync("service-account.json"));
const clientEmail = credentials.client_email;
console.log("Service Account:", clientEmail);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

// Replace with your spreadsheet ID
const SPREADSHEET_ID = "1rmREyYRz2mAL5-v51TV8xhOBOaLLMd3ip-ccIoTz9jw";

async function test() {
  try {
    const tabs = ["Pets", "TradeExample", "Variants", "MarketReport"];
    for (const tab of tabs) {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${tab}!A2:Z`,
      });
      console.log(`✅ ${tab}:`, res.data.values ? res.data.values.slice(0, 5) : "No data");
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

test();
