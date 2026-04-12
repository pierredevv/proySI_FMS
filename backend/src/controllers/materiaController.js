const pool = require('../config/db');

const getCamposSaber = async (req, res) => {
    try {
        const campos = await pool.query('SELECT * FROM campo_saber ORDER BY orden_visualizacion');
        res.json(campos.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los campos del saber', error: error.message });
    }
}

const getMaterias = async (req, res) => {
    try {
        const materias = await pool.query(
            `
            SELECT m.id_materia, m.nombre_materia, m.descripcion, c.nombre_campo, m.aplica_primaria, m.estado 
            FROM materia m
            JOIN campo_saber c ON m.id_campo = c.id_campo
            ORDER BY c.orden_visualizacion, m.nombre_materia
        `);
        res.json(materias.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener materias', error: error.message });
    }
}


const createMateria = async (req, res) => {
    const { nombre_materia, descripcion, decripcion, id_campo, aplica_primaria, estado } = req.body;
    const desc = descripcion ?? decripcion;
    try {

        const nuevaMateria = await pool.query(
            'INSERT INTO materia (nombre_materia, descripcion, id_campo, aplica_primaria, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre_materia, desc, id_campo, aplica_primaria, estado]
        );

        res.status(201).json(nuevaMateria.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la materia', error: error.message });
    }
}

module.exports = { getCamposSaber, getMaterias, createMateria };
