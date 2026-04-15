const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const getProfesores = async (req, res) => {
    try {
        const query = `
            SELECT p.*, u.username, u.estado as usuario_activo
            FROM profesor p
            LEFT JOIN usuario u ON p.id_usuario = u.id_usuario
            ORDER BY p.apellido ASC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener lista de profesores', error: error.message });
    }
};

const createProfesor = async (req, res) => {
    const {
        nombre, apellido, ci, profesion, genero,
        id_usuario,
        crear_cuenta, username, password
    } = req.body;

    if (!nombre || !apellido || !ci || !genero) {
        return res.status(400).json({ message: 'Los datos básicos del profesor son obligatorios.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const ciCheck = await client.query('SELECT id_profesor FROM profesor WHERE ci = $1', [ci]);
        if (ciCheck.rows.length > 0) {
            throw new Error('Profesor ya existe (CI duplicado).');
        }

        let usuarioFinalId = id_usuario;

        if (crear_cuenta) {
            const userCheck = await client.query('SELECT id_usuario FROM usuario WHERE username = $1', [username]);
            if (userCheck.rows.length > 0) {
                throw new Error('El nombre de usuario ya está en uso.');
            }

            const salt = await bcrypt.genSalt(10);
            const passHash = await bcrypt.hash(password, salt);
            const newUser = await client.query(
                'INSERT INTO usuario (username, password_hash, id_rol) VALUES ($1, $2, 3) RETURNING id_usuario',
                [username, passHash]
            );

            usuarioFinalId = newUser.rows[0].id_usuario;
        } else if (usuarioFinalId) {
            const linkCheck = await client.query('SELECT id_profesor FROM profesor WHERE id_usuario = $1', [usuarioFinalId]);
            if (linkCheck.rows.length > 0) {
                throw new Error('La cuenta de usuario seleccionada ya está vinculada a otro profesor.');
            }
        }

        const newProfesor = await client.query(
            `INSERT INTO profesor (id_usuario, nombre, apellido, ci, profesion, genero) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [usuarioFinalId, nombre, apellido, ci, profesion, genero]
        );

        await client.query('COMMIT');
        res.status(201).json({
            message: 'Profesor registrado correctamente.',
            profesor: newProfesor.rows[0]
        });

    } catch (error) {
        await client.query('ROLLBACK');
        res.status(400).json({ message: error.message });
    } finally {
        client.release();
    }
};

module.exports = { getProfesores, createProfesor };
