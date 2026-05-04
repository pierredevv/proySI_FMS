const express = require('express');
const router = express.Router();
const { login, forgotPassword, resetPassword, logout } = require('../controllers/authController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', verificarToken, logout);

module.exports = router;
