var express = require("express");
var router = express.Router();
const jwt = require('jsonwebtoken');
var User = require('../models/admin');
var bcrypt = require("bcryptjs");

// Register section

router.post('/register', async (req, res) => {
  let { email, password, secret } = req.body;
  password = await bcrypt.hash(password, 12);
  let payload = { subject: email, secret: secret, extra: password };
  let token = jwt.sign(payload, process.env.PRIVATEKEY);
  let user = new User({ email, password, token });
  user.save(async (err, registeredUser) => {
    if (err) {
      return err;
    } else {
      res.status(200).send({ token });
    }
  });
});

// Login section

router.post('/login', (req, res) => {
  let userData = req.body;
  User.findOne({ email: userData.email }, async (err, user) => {
    if (err) {
      return err;
    }
    if (!user || user === null || user === undefined) {
      res.status(401).send('Invalid user');
    } else {
      let passwordCheck = await bcrypt.compare(userData.password, user.password);
      if (passwordCheck) {
        let payload = { subject: user.email, secret: userData.secret, extra: user.password };
        let token = jwt.sign(payload, process.env.PRIVATEKEY);
        res.status(200).send({ token });
      } else {
        res.status(401).send("Invalid password");
      }
    }

  });
});

module.exports = router;