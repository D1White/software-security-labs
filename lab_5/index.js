const express = require('express');
const bodyParser = require('body-parser');
const { auth } = require('express-oauth2-jwt-bearer');

const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const AUTH_BASE_URL = 'https://dev-nb6gol20tvvtznpi.us.auth0.com';

const checkJwt = auth({
  audience: `${AUTH_BASE_URL}/api/v2/`,
  issuerBaseURL: `${AUTH_BASE_URL}/`,
});

app.get('/api/public', function (req, res) {
  res.json({
    message: 'Public endpoint',
  });
});

app.get('/api/private', checkJwt, function (req, res) {
  res.json({
    message: 'Private endpoint',
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
