const pool = require('../config/db');
const { get } = require('../routes/authRoutes');

const getAulas = async (req, res) => {
    try {
        const aulas = await pool.query('SELECT * FROM aula ORDER BY numero_aula');
        res.json(aulas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las aulas', error: error.message });
    }
};

const createAula = async (req, res) => {
    const { numero_aula, descripcion, cantidad_mesas, cantidad_sillas, capacidad_estudiantes } = req.body;

    try {

        const nuevaAula = await pool.query(
            'INSERT INTO aula (numero_aula, descripcion, cantidad_mesas, cantidad_sillas, capacidad_estudiantes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [numero_aula, descripcion, cantidad_mesas, cantidad_sillas, capacidad_estudiantes]
        );
        res.status(201).json(nuevaAula.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el aula', error: error.message });
    }
};

const getNiveles = async (req, res) => {
    try {
        const niveles = await pool.query('SELECT * FROM nivel');
        res.json(niveles.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obener los niveles', error: error.message });
    }
}

const getGrados = async (req, res) => {
    try {
        const grados = await pool.query(`
            SELECT g.id_grado, g.nombre_grado, n.nombre_nivel, g.id_nivel 
            FROM grado g 
            JOIN nivel n ON g.id_nivel = n.id_nivel
        `);
        res.json(grados.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obenter los grados', error: error.message });
    }
}

module.exports = { getAulas, createAula, getNiveles, getGrados };
