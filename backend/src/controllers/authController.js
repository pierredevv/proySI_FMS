const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const transporter = require('../config/mailer');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM usuario WHERE username = $1 OR email = $1', [username]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Usuario o Contraseña invalidos' });
        }

        const user = userResult.rows[0];

        if (!user.estado) {
            return res.status(403).json({ message: 'Cuenta desactivada, contacte con el administrador' });
        }

        if (user.bloqueado_hasta && new Date(user.bloqueado_hasta) > new Date()) {
            return res.status(403).json({
                message: 'Cuenta bloqueada temporalmente por multiples intentos fallidos. Intente mas tarde'
            });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            let intentos = (user.intentos_fallidos || 0) + 1;
            let bloqueado_hasta = null;

            if (intentos >= 3) {
                const minutosBloqueo = 3;
                bloqueado_hasta = new Date(Date.now() + minutosBloqueo * 60000);
            }

            await pool.query(
                'UPDATE usuario SET intentos_fallidos = $1, bloqueado_hasta = $2 WHERE id_usuario = $3',
                [intentos, bloqueado_hasta, user.id_usuario]
            );

            return res.status(401).json({ message: 'Usuario o Contraseña invalidos' });
        }

        await pool.query(
            'UPDATE usuario SET intentos_fallidos = 0, bloqueado_hasta = NULL, ultimo_acceso = NOW() WHERE id_usuario = $1',
            [user.id_usuario]
        );

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

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const userResult = await pool.query(
            'SELECT id_usuario, username FROM usuario WHERE email = $1',
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.json({ message: 'Si el correo existe, se ha enviado un código de recuperación.' });
        }

        const user = userResult.rows[0];

        const token = crypto.randomBytes(20).toString('hex');
        const expira = new Date(Date.now() + 15 * 60000);

        await pool.query(
            'UPDATE usuario SET reset_token = $1, reset_token_expira = $2 WHERE id_usuario = $3',
            [token, expira, user.id_usuario]
        );

        const resetLink = `http://localhost:3000/reset-password/${token}`;
        await transporter.sendMail({
            from: '"Soporte Fausto Medrano" <soporte@colegio.com>',
            to: email,
            subject: "Recuperación de Contraseña",
            html: `<b>Hola ${user.username},</b><br>Haz clic en el siguiente enlace para restablecer tu clave: <a href="${resetLink}">Restablecer clave</a>. Expira en 15 minutos.`
        });

        res.json({ message: 'Si el correo existe, se ha enviado un código de recuperación.' });
    } catch (error) {
        res.status(500).json({ message: 'Error interno', error: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const userResult = await pool.query(
            'SELECT * FROM usuario WHERE reset_token = $1 AND reset_token_expira > NOW()',
            [token]
        );

        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'El token es inválido o ha expirado.' });
        }

        const user = userResult.rows[0];

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(newPassword, salt);

        await pool.query(
            'UPDATE usuario SET password_hash = $1, reset_token = NULL, reset_token_expira = NULL WHERE id_usuario = $2',
            [password_hash, user.id_usuario]
        );

        res.json({ message: 'Contraseña actualizada con éxito.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al resetear la clave', error: error.message });
    }
};

const logout = (req, res) => {
    res.json({ message: 'Cierre de sesion existoso. Se debe eliminar el token en el cliente (front) eso hace yimy' })
}

module.exports = { login, forgotPassword, resetPassword, logout };
