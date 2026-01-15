const express = require('express');
const {
  register,
  login,
  getCurrentUser,
  refreshToken
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Routes publiques
router.post('/register', register);
router.post('/login', login);

// Routes protégées
router.get('/me', verifyToken, getCurrentUser);
router.post('/refresh-token', verifyToken, refreshToken);

module.exports = router;