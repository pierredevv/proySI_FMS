/**
 * Rutas bajo /api/users (definido en server.js).
 * :id en la URL es req.params.id (id_usuario en la base de datos).
 */
const express = require('express');
const router = express.Router();
const { createUser, getUsers, updateUser, deleteUser } = require('../controllers/userController');

router.post('/', createUser);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
