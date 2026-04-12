const e = require('express');
const pool = require('../config/db');

const createGestion = async (req, res) => {
    const { anio, fecha_inicio, fecha_fin, estado } = req.body;

    try {
        const nuevaGestion = await pool.query(
            'INSERT INTO gestion_academica (anio, fecha_inicio, fecha_fin, estado) VALUES ($1, $2, $3, $4) RETURNING *',
            [anio, fecha_inicio, fecha_fin, estado || 'planificada']
        );

        res.status(201).json({ mesagge: 'Gestion creada con exito', gestion: nuevaGestion.rows[0] });
    } catch (error) {
        res.status(500).json({ mesagge: 'Error al crear la gestion', error: error.mesagge });
    }
};

const getGestiones = async (req, res) => {
    try {
        const gestiones = await pool.query('SELECT * FROM gestion_academica ORDER BY anio DESC',);
        res.json(gestiones.rows);
    } catch (error) {
        res.status(500).json({ mesagge: 'Error al obtener las gestiones', error: error.mesagge });
    }
};

const updateGestion = async (req, res) => {
    const { id } = req.params;
    const { anio, fecha_inicio, fecha_fin, estado } = req.body;

    try {

        const updatedGestion = await pool.query(
            'UPDATE gestion_academica SET anio = $1, fecha_inicio = $2, fecha_fin = $3, estado = $4 WHERE id_gestion = $5 RETURNING *',
            [anio, fecha_inicio, fecha_fin, estado, id]
        );

        if (updatedGestion.rows.length == 0) return res.status(404).json({ message: 'No se encontro la gestion' });

        res.json({ mesagge: 'Gestion actualizada con exito', gestion: updatedGestion.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la gestion', error: error.mesagge });
    }
};

module.exports = { createGestion, getGestiones, updateGestion };
