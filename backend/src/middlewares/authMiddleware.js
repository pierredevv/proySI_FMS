const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado, No se obtuvo (proporciono) un token' });
    }

    try {

        const decodificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decodificado;
        next();

    } catch (error) {
        return res.status(403).json({ message: 'El Token es invalido o a expirado' });
    }
};

const esSuperUsuario = (req, res, next) => {
    if (!req.usuario || req.usuario.role !== 1) {
        return res.status(403).json({ message: 'Operacion rechazada. No tiene los permisos necesarios' });
    }
    next();
}

const esAdminODirector = (req, res, next) => {
    if (!req.usuario || (req.usuario.role !== 1 && req.usuario.role !== 2)) {
        return res.status(403).json({ message: 'Operación rechazada. No tiene los permisos de gestión necesarios.' });
    }
    next();
};

module.exports = { verificarToken, esSuperUsuario, esAdminODirector };

