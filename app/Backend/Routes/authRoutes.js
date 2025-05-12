const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const authenticateToken = require('../Middleware/authenticateToken');

router.post('/login', authController.login);
router.get('/me', authenticateToken, authController.getUserDetails);
router.get('/admin', authenticateToken, (req, res) => {
  res.send('Admin Page');
});

module.exports = router;