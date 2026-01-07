const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const readline = require('readline');

// Note: I kept your specific filename "credetnialdd.json"
const CREDENTIALS_PATH = path.join(__dirname, '../credetnialdd.json');
const TOKEN_PATH = path.join(__dirname, '../token.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

async function getAccessToken() {
  const content = fs.readFileSync(CREDENTIALS_PATH);
  const credentials = JSON.parse(content);
  
  // destructure your specific keys
  const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;
  
  const oAuth2Client = new google.auth.OAuth2(
    client_id, 
    client_secret, 
    redirect_uris[0]
  );

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this url:', authUrl);
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      
      // Save the token to disk
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      console.log('✅ Token stored to', TOKEN_PATH);
      console.log('🚀 You can now start your main server!');
    });
  });
}

getAccessToken();