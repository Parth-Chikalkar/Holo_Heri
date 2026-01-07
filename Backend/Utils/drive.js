const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const stream = require("stream");

// 📁 YOUR FOLDER ID
const FOLDER_ID = "1_8w1bwm7zzdfgtQbaQ5wQ9kaP-lx1F_m";

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const TOKEN_PATH = path.join(__dirname, "../token.json");
const CREDENTIALS_PATH = path.join(__dirname, "../credetnialdd.json");

function authorize() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error("❌ Credentials file not found at " + CREDENTIALS_PATH);
  }
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
  } else {
    throw new Error("❌ Missing token.json! Run 'generateToken.js' first.");
  }
}

const drive = google.drive({ version: "v3", auth: authorize() });

async function uploadToDrive(file) {
  try {
    console.log(`⬆️ Uploading to Drive Folder (${FOLDER_ID}):`, file.originalname);

    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    // 1. Upload the File
    const res = await drive.files.create({
      requestBody: {
        name: file.originalname,
        parents: [FOLDER_ID],
      },
      media: {
        mimeType: file.mimetype,
        body: bufferStream,
      },
    });

    const fileId = res.data.id;
    console.log("✅ Upload Successful. ID:", fileId);

    // 2. MAKE FILE PUBLIC (Crucial for Frontend)
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    console.log("🌍 File is now Public");

    // 3. Return the View Link
    return `https://drive.google.com/uc?id=${fileId}`; // 'uc' link is best for direct display
    
  } catch (error) {
    console.error("❌ Drive Upload Error:", error.message);
    throw error;
  }
}

module.exports = { uploadToDrive };