const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/signup', authController.signup);
router.post('/register', authController.signup); // frontend dialect alias
router.post('/login', authController.login);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
