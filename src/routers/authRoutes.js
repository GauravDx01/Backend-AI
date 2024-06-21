// routes/authRoutes.js
const express = require('express');
const { register, login , getUser } = require('../controllers/authController');
const { authenticate, authorizeAdmin, authorizeSuperAdmin } = require('../controllers/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/get-user/:id' , getUser)
router.get('/admin', authenticate, authorizeAdmin, (req, res) => {
  res.send('Admin Area');
});

router.get('/superadmin', authenticate, authorizeSuperAdmin, (req, res) => {
  res.send('Superadmin Area');
});

module.exports = router;
