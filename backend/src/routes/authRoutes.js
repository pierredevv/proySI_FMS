/**
 * Rutas bajo el prefijo /api/auth (definido en server.js).
 * Solo enlazan método HTTP + path con funciones del controlador.
 */
const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/authController');

// Cuerpo JSON: { username, password }
router.post('/login', login);
// Aviso de cierre; el token se borra en el cliente
router.post('/logout', logout);

module.exports = router;
