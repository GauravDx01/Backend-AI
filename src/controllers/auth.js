// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Access Denied');

  jwt.verify(token, 'secret', (err, user) => {
    if (err) return res.status(403).send('Invalid Token');
    req.user = user;
    next();
  });
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).send('Admin access required');
  }
};

const authorizeSuperAdmin = (req, res, next) => {
  if (req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).send('Superadmin access required');
  }
};

module.exports = { authenticate, authorizeAdmin, authorizeSuperAdmin };
