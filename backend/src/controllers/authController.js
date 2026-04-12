const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM usuario WHERE username = $1', [username]);
        if (userResult.rows.length == 0) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const user = userResult.rows[0];

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id: user.id_usuario, role: user.id_rol },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        )

        res.json({ message: 'Inicio de sesion exitoso gogo', token, role: user.id_rol });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

const logout = (req, res) => {
    res.json({ message: 'Cierre de sesion existoso. Se debe eliminar el token en el cliente (front) eso hace yimy' })
}

module.exports = { login, logout };
