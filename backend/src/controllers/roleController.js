const pool = require('../config/db');
const { get } = require('../routes/authRoutes');

const getRoles = async (req, res) => {
    try {
        const query = `
            SELECT r.id_rol, r.nombre_rol, r.descripcion, r.estado, 
                   COUNT(rp.id_permiso) as cantidad_permisos
            FROM rol r
            LEFT JOIN rol_permiso rp ON r.id_rol = rp.id_rol
            GROUP BY r.id_rol
            ORDER BY r.id_rol ASC
        `;

        const result = await pool.query(query);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el listado de los roles', error: error.message });
    }
}

const getPermissions = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM permiso ORDER BY modulo, nombre_permiso');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obetener el listado de permisos', error: error.message });
    }
}

const createRole = async (req, res) => {
    const { nombre_rol, descripcion, permisos } = req.body;

    if (!nombre_rol || !permisos || !Array.isArray(permisos)) {
        return res.status(400).json({ message: 'Nombre de rol y lista de permisos son obligatorios' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const roleResult = await client.query(
            'INSERT INTO rol (nombre_rol, descripcion) VALUES ($1, $2) RETURNING id_rol',
            [nombre_rol, descripcion]
        );
        const newRoleId = roleResult.rows[0].id_rol;

        for (const permisoId of permisos) {
            await client.query(
                'INSERT INTO rol_permiso (id_rol, id_permiso) VALUES ($1, $2)',
                [newRoleId, permisoId]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Rol creado exitosamente', id_rol: newRoleId });
    } catch (error) {
        await client.query('ROLLBACK');
        if (error.code === '23505') {
            return res.status(400).json({ message: 'El nombre del rol ya esta en uso' });
        }

        res.status(500).json({ message: 'Error al crear el nuevo rol', error: error.message });
    } finally {
        client.release();
    }
}

const deleteRole = async (req, res) => {
    const { id } = req.params;

    try {
        const userCheck = await pool.query(
            'SELECT COUNT(*) FROM usuario WHERE id_rol = $1 AND estado = TRUE',
            [id]
        );

        if (parseInt(userCheck.rows[0].count) > 0) {
            return res.status(400).json({
                message: 'No se puede eliminar el rol por que hay usuarios activos asociados a ese mismo rol. Sugerencia: Desactivar e rol o cambiar el rol de los usuarios primero.'
            });
        }

        const deleteResult = await pool.query('DELETE FROM rol WHERE id_rol = $1 RETURNING *', [id]);

        if (deleteResult.rows.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        res.json({ message: 'Rol eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el rol', error: error.message });
    }
}

module.exports = { getRoles, getPermissions, createRole, deleteRole };
