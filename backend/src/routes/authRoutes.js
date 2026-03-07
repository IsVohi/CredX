const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyAuth } = require('../middleware/authMiddleware');

// POST /auth/login
router.post('/login', authController.login);

// POST /auth/register
router.post('/register', authController.register);

// GET /auth/me
router.get('/me', verifyAuth, authController.me);

// POST /auth/complete-profile
router.post('/complete-profile', verifyAuth, authController.completeProfile);

module.exports = router;
