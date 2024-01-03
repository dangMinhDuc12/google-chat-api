const express = require('express');
const app = express();
const { google } = require('googleapis');
const fetch = require('node-fetch');

const clientId = '877547519162-9a6arl4dvmrbj2kaej200m46oevqcpda.apps.googleusercontent.com';
const clientSecret = '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';
const redirectUri = 'https://developers.google.com/oauthplayground';
const refreshToken =
  '1//04iGEfBlXe0ocCgYIARAAGAQSNwF-L9IroYQdFrSC0d6INTAa4P8kd0aM_VSCkZ2ql9olZ_Ge92xUScmDGfla2n-E8ytBcjQTwsU';

const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
oAuth2Client.setCredentials({ refresh_token: refreshToken });

app.get('/test', async (req, res, next) => {
  const { token } = await oAuth2Client.getAccessToken();

  const callGetSpace = await fetch(`https://chat.googleapis.com/v1/spaces`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
  });

  const allSpaces = await callGetSpace.json();

  const spaceToReport = allSpaces.spaces.find((spc) => spc.displayName === 'AICycle Report');
  const spaceToReportId = spaceToReport.name;

  const callSendMessage = await fetch(
    `https://chat.googleapis.com/v1/${spaceToReportId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Hello world',
      }),
    }
  );

  const sendMesageRes = await callSendMessage.json();

  return res.status(200).send(sendMesageRes);
});

app.listen(3000, () => {
  console.log('server is running in port 3000');
});
