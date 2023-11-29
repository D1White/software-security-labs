const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SECRET_KEY = 'ADMIN_KEY';

app.use((req, res, next) => {
  const token = req.header('Authorization');

  if (token) {
    jwt.verify(token, SECRET_KEY, (err, user) => {
      req.user = user;
    });
  }

  next();
});

app.get('/', (req, res) => {
  if (req?.user?.username) {
    return res.json({
      username: req.user.username,
      logout: 'http://localhost:3000/logout',
    });
  }
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/logout', (req, res) => {
  res.redirect('/');
});

const users = [
  {
    login: 'Login',
    password: 'Password',
    username: 'Username',
  },
  {
    login: 'Login1',
    password: 'Password1',
    username: 'Username1',
  },
];

app.post('/api/login', (req, res) => {
  const { login, password } = req.body;

  const user = users.find(
    (user) => user.login === login && user.password === password
  );

  if (!!user) {
    const token = jwt.sign({ username: user.username }, SECRET_KEY, {
      expiresIn: '1h',
    });

    res.json({ token });
  } else {
    res.status(401).send();
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
