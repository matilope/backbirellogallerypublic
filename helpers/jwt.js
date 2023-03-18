const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request');
  }
  let token = req.headers.authorization.split(' ')[1];
  if (token === 'null') {
    return res.status(401).send('Unauthorized request');
  }
  let payload = jwt.verify(token, process.env.PRIVATEKEY);
  if (!payload || payload == undefined || payload == null) {
    return res.status(401).send('Unauthorized request');
  }
  next();
}

module.exports = verifyToken;