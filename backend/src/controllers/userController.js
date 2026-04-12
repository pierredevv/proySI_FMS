/**
 * CRUD de la tabla usuario: alta, listado, actualización y borrado.
 * Las contraseñas nunca se guardan en claro; solo password_hash.
 */
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * POST /api/users
 * Crea un registro en usuario con username, hash de password e id_rol.
 */
const createUser = async (req, res) => {
    const { username, password, id_rol } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO usuario (username, password_hash, id_rol) VALUES ($1, $2, $3) RETURNING id_usuario, username, id_rol',
            [username, password_hash, id_rol]
        );

        res.status(201).json({
            message: 'Usuario creado con exito',
            user: newUser.rows[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
    }
};

/**
 * GET /api/users
 * Lista usuarios sin exponer password_hash.
 */
const getUsers = async (req, res) => {
    try {
        const usuario = await pool.query('SELECT id_usuario, username, id_rol, fecha_creacion FROM usuario');
        res.json(usuario.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener Usuarios', error: error.message });
    }
};

/**
 * PUT /api/users/:id
 * Actualiza username e id_rol del usuario cuyo id_usuario coincide con :id.
 */
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, id_rol } = req.body;
    try {
        const updatedUser = await pool.query(
            'UPDATE usuario SET username = $1, id_rol = $2 WHERE id_usuario = $3 RETURNING id_usuario, id_rol',
            [username, id_rol, id]
        );

        if (updatedUser.rows.length == 0) return res.status(404).json({ message: 'Usuario no encontrado' });

        res.json(updatedUser.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
    }
};

/**
 * DELETE /api/users/:id
 * Elimina el usuario con ese id_usuario.
 */
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await pool.query('DELETE FROM usuario WHERE id_usuario = $1 RETURNING *', [id]);

        if (deletedUser.rows.length == 0) return res.status(404).json({ message: 'Usuario no encontrado xd' });

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
    }
};

module.exports = { createUser, getUsers, updateUser, deleteUser };
