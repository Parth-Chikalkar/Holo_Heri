const { google } = require("googleapis");
const stream = require("stream");
require("dotenv").config(); // Load environment variables

// 📁 YOUR FOLDER ID
const FOLDER_ID = "1_8w1bwm7zzdfgtQbaQ5wQ9kaP-lx1F_m";

// Initialize Auth using Environment Variables
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set the Refresh Token (This allows it to generate new access tokens automatically)
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: "v3", auth: oauth2Client });

async function uploadToDrive(file) {
  try {
    console.log(`⬆️ Uploading to Drive Folder (${FOLDER_ID}):`, file.originalname);

    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

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

    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    console.log("🌍 File is now Public");

    return `https://drive.google.com/uc?id=${fileId}`; 

  } catch (error) {
    console.error("❌ Drive Upload Error:", error.message);
    throw error;
  }
}

module.exports = { uploadToDrive };