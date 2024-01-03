const express = require('express');
const app = express();
const { google } = require('googleapis');
const fetch = require('node-fetch');
const Handlebars = require('handlebars');
const fs = require('fs');
const { JWT } = require('google-auth-library');

// const clientId = '877547519162-9a6arl4dvmrbj2kaej200m46oevqcpda.apps.googleusercontent.com';
// const clientSecret = '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';
// const redirectUri = 'https://developers.google.com/oauthplayground';
// const refreshToken =
//   '1//04-XVQPcR9zyHCgYIARAAGAQSNwF-L9IrHJy8zHVvgJHNTdCm01HhvtTMEVsUe6KasEEXRPLLOlCRJNMZUnDiikpuJakXnRjERt4';

// const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
// oAuth2Client.setCredentials({ refresh_token: refreshToken });

const credentials = require('./credential.json');

// Set up the JWT client
const jwtClient = new JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ['https://www.googleapis.com/auth/chat.bot'],
});

// Set up the Google Chat API client
const chat = google.chat({ version: 'v1', auth: jwtClient });

app.get('/test', async (req, res, next) => {
  const test = await chat.spaces.list();

  const file = fs.readFileSync('./template_mail.txt', { encoding: 'utf-8' });

  await chat.spaces.messages.create({
    parent: 'spaces/AAAAceSSAWc',
    requestBody: {
      text: file,
    },
  });

  // const { token } = await oAuth2Client.getAccessToken();

  // const callGetSpace = await fetch(`https://chat.googleapis.com/v1/spaces`, {
  //   method: 'GET',
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //     'Content-type': 'application/json',
  //   },
  // });

  // const allSpaces = await callGetSpace.json();

  // const spaceToReport = allSpaces.spaces.find((spc) => spc.displayName === 'AICycle Report');
  // const spaceToReportId = spaceToReport.name;

  // const file = fs.readFileSync('./template_mail.txt', { encoding: 'utf-8' });

  // const template = Handlebars.compile(file);

  // const callSendMessage = await fetch(
  //   `https://chat.googleapis.com/v1/${spaceToReportId}/messages`,
  //   {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       'Content-type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       text: template(),
  //     }),
  //   }
  // );

  // const sendMesageRes = await callSendMessage.json();

  return res.status(200).send(test);
});

app.listen(3000, () => {
  console.log('server is running in port 3000');
});
