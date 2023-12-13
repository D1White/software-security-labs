const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');

const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const AUTH_BASE_URL = 'https://dev-nb6gol20tvvtznpi.us.auth0.com';
const clientId = 'tNrgHVlimsQM4PMFYqc9vYc3tlhhbjTr';
const clientSecret =
  'ny0AXn2IbxFB5l7J_MusZuHaVVX5HEu8LCCHjPisOSbbU1w85oEI_eHkImOEiLix';

app.get('/', async (req, res) => {
  const authHeader = req.header('Authorization') || '';
  const token = authHeader.replace('Baerer ', '');
  console.log('token ' + token);
  try {
    if (!token) {
      throw new Error('Unauthorized');
    }

    const userRes = await axios.get(`${AUTH_BASE_URL}/userinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.json({ unauthorized: true });
  } catch (err) {
    res.sendFile(path.join(__dirname + '/index.html'));
  }
});

app.post('/api/login', async (req, res) => {
  const { code } = req.body;

  try {
    const authRes = await axios.post(`${AUTH_BASE_URL}/oauth/token`, {
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: 'http://localhost:3000/',
      scope: 'openid',
    });

    const access_token = authRes.data.access_token;

    if (!access_token) {
      throw new Error('Unauthorized');
    }

    res.json({ access_token });
  } catch (err) {
    res.status(401).send();
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
