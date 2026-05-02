const pool = require('../config/db');

const getEstudiantes = async (req, res) => {
    const { search, id_nivel, id_grado, turno, estado, edad_min, edad_max } = req.query;
    try {
        let conditions = [];
        let params = [];
        let idx = 1;

        if (search) {
            conditions.push(`(ci ILIKE $${idx} OR nombre || ' ' || apellido ILIKE $${idx})`);
            params.push(`%${search}%`);
            idx++;
        }
        if (estado) {
            conditions.push(`estado = $${idx++}`);
            params.push(estado);
        }
        if (edad_min) {
            conditions.push(`EXTRACT(YEAR FROM AGE(fecha_nacimiento)) >= $${idx++}`);
            params.push(parseInt(edad_min));
        }
        if (edad_max) {
            conditions.push(`EXTRACT(YEAR FROM AGE(fecha_nacimiento)) <= $${idx++}`);
            params.push(parseInt(edad_max));
        }
        // Filtros por nivel/grado/turno requieren JOIN con inscripcion y curso
        let baseQuery;
        if (id_nivel || id_grado || turno) {
            baseQuery = `SELECT DISTINCT e.* FROM estudiante e
                JOIN inscripcion i ON e.id_estudiante = i.id_estudiante AND i.estado = 'inscrito'
                JOIN curso c ON i.id_curso = c.id_curso
                JOIN grado g ON c.id_grado = g.id_grado`;
            if (turno)    { conditions.push(`c.turno = $${idx++}`);    params.push(turno); }
            if (id_grado) { conditions.push(`c.id_grado = $${idx++}`); params.push(id_grado); }
            if (id_nivel) { conditions.push(`g.id_nivel = $${idx++}`); params.push(id_nivel); }
        } else {
            baseQuery = 'SELECT * FROM estudiante e';
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const query = `${baseQuery} ${whereClause} ORDER BY e.apellido ASC, e.nombre ASC`;

        const estudiantes = await pool.query(query, params);
        res.json(estudiantes.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener estudiantes', error: error.message });
    }
};

const createEstudiante = async (req, res) => {
    const { nombre, apellido, ci, fecha_nacimiento, genero, de_traslado, institucion_origen } = req.body;

    if (!nombre || !apellido || !genero) {
        return res.status(400).json({ message: 'El nombre, apellido y género son obligatorios.' });
    }

    if (fecha_nacimiento && new Date(fecha_nacimiento) > new Date()) {
        return res.status(400).json({ message: 'La fecha de nacimiento no puede ser una fecha futura.' });
    }

    try {
        if (ci) {
            const ciCheck = await pool.query('SELECT nombre, apellido FROM estudiante WHERE ci = $1', [ci]);
            if (ciCheck.rows.length > 0) {
                const est = ciCheck.rows[0];
                return res.status(409).json({ message: `Ya existe un estudiante registrado con el CI ${ci}: ${est.nombre} ${est.apellido}.` });
            }
        }

        // Nota de traslado para persistir en campo observaciones
        const notaTraslado = de_traslado
            ? ` | ESTUDIANTE DE TRASLADO. Origen: ${institucion_origen || 'No especificado'}`
            : null;
        const observacionesVal = ((req.body.observaciones || '') + (notaTraslado || '')).trim() || null;

        let nuevoEstudiante;
        try {
            // Intenta con columna observaciones (disponible tras migracion_ciclo2.sql)
            nuevoEstudiante = await pool.query(
                `INSERT INTO estudiante (nombre, apellido, ci, fecha_nacimiento, genero, estado, observaciones)
                 VALUES ($1, $2, $3, $4, $5, 'activo', $6) RETURNING *`,
                [nombre, apellido, ci || null, fecha_nacimiento || null, genero, observacionesVal]
            );
        } catch (colErr) {
            if (colErr.message.includes('observaciones')) {
                // Columna aun no existe: insertar sin ella
                nuevoEstudiante = await pool.query(
                    `INSERT INTO estudiante (nombre, apellido, ci, fecha_nacimiento, genero, estado)
                     VALUES ($1, $2, $3, $4, $5, 'activo') RETURNING *`,
                    [nombre, apellido, ci || null, fecha_nacimiento || null, genero]
                );
            } else {
                throw colErr;
            }
        }

        res.status(201).json({
            message: 'Estudiante registrado correctamente',
            estudiante: nuevoEstudiante.rows[0],
            ...(notaTraslado && { nota_traslado: notaTraslado.trim() })
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear estudiante', error: error.message });
    }
};

const updateEstudiante = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, fecha_nacimiento, genero, estado, motivo_salida } = req.body;

    try {
        let observacionesUpdate = "";
        if (estado === 'retirado' || estado === 'egresado') {
            if (!motivo_salida) return res.status(400).json({ message: 'Debe especificar el motivo del cambio de estado.' });
            observacionesUpdate = ` | Motivo ${estado}: ${motivo_salida}`;
        }

        // observaciones no existe en la tabla estudiante (pendiente migración).
        // El motivo de retiro/egreso se conserva en memoria para el log de respuesta.
        let updated;
        try {
            // Intenta persistir observaciones (disponible tras migracion_ciclo2.sql)
            updated = await pool.query(
                `UPDATE estudiante SET 
                    nombre = COALESCE($1, nombre),
                    apellido = COALESCE($2, apellido),
                    fecha_nacimiento = COALESCE($3, fecha_nacimiento),
                    genero = COALESCE($4, genero),
                    estado = COALESCE($5, estado),
                    observaciones = CASE
                        WHEN $6 IS NOT NULL AND $6 != ''
                        THEN COALESCE(observaciones, '') || $6
                        ELSE observaciones
                    END
                 WHERE id_estudiante = $7 RETURNING *`,
                [nombre, apellido, fecha_nacimiento, genero, estado, observacionesUpdate || null, id]
            );
        } catch (colErr) {
            if (colErr.message.includes('observaciones')) {
                updated = await pool.query(
                    `UPDATE estudiante SET
                        nombre = COALESCE($1, nombre),
                        apellido = COALESCE($2, apellido),
                        fecha_nacimiento = COALESCE($3, fecha_nacimiento),
                        genero = COALESCE($4, genero),
                        estado = COALESCE($5, estado)
                     WHERE id_estudiante = $6 RETURNING *`,
                    [nombre, apellido, fecha_nacimiento, genero, estado, id]
                );
            } else {
                throw colErr;
            }
        }

        if (updated.rows.length === 0) return res.status(404).json({ message: 'Estudiante no encontrado.' });
        res.json({
            message: 'Expediente actualizado',
            estudiante: updated.rows[0],
            // Motivo registrado en backend (persistir en BD requiere migración: ALTER TABLE estudiante ADD COLUMN observaciones TEXT)
            ...(observacionesUpdate && { nota_motivo: observacionesUpdate.trim() })
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar estudiante', error: error.message });
    }
};

const exportarEstudiantesCsv = async (req, res) => {
    // Reutilizar la misma lógica de filtros de getEstudiantes
    const { search, id_nivel, id_grado, turno, estado, edad_min, edad_max } = req.query;
    try {
        let conditions = [];
        let params = [];
        let idx = 1;

        if (search) {
            conditions.push(`(e.ci ILIKE $${idx} OR e.nombre || ' ' || e.apellido ILIKE $${idx})`);
            params.push(`%${search}%`);
            idx++;
        }
        if (estado) {
            conditions.push(`e.estado = $${idx++}`);
            params.push(estado);
        }
        if (edad_min) {
            conditions.push(`EXTRACT(YEAR FROM AGE(e.fecha_nacimiento)) >= $${idx++}`);
            params.push(parseInt(edad_min));
        }
        if (edad_max) {
            conditions.push(`EXTRACT(YEAR FROM AGE(e.fecha_nacimiento)) <= $${idx++}`);
            params.push(parseInt(edad_max));
        }
        
        let baseQuery;
        if (id_nivel || id_grado || turno) {
            baseQuery = `SELECT DISTINCT e.*, c.paralelo, g.nombre_grado, n.nombre_nivel FROM estudiante e
                JOIN inscripcion i ON e.id_estudiante = i.id_estudiante AND i.estado = 'inscrito'
                JOIN curso c ON i.id_curso = c.id_curso
                JOIN grado g ON c.id_grado = g.id_grado
                JOIN nivel n ON g.id_nivel = n.id_nivel`;
            if (turno)    { conditions.push(`c.turno = $${idx++}`);    params.push(turno); }
            if (id_grado) { conditions.push(`c.id_grado = $${idx++}`); params.push(id_grado); }
            if (id_nivel) { conditions.push(`g.id_nivel = $${idx++}`); params.push(id_nivel); }
        } else {
            baseQuery = `SELECT e.*, 'N/A' as paralelo, 'N/A' as nombre_grado, 'N/A' as nombre_nivel FROM estudiante e`;
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const query = `${baseQuery} ${whereClause} ORDER BY e.apellido ASC, e.nombre ASC`;

        const estudiantes = await pool.query(query, params);

        // Generar CSV
        const csvHeader = ['CI', 'Apellido', 'Nombre', 'Género', 'Estado', 'Nivel', 'Grado', 'Paralelo'].join(',');
        const csvRows = estudiantes.rows.map(e => {
            return [
                e.ci || 'N/A',
                e.apellido,
                e.nombre,
                e.genero,
                e.estado,
                e.nombre_nivel,
                e.nombre_grado,
                e.paralelo
            ].map(col => `"${col}"`).join(',');
        });

        const csvString = [csvHeader, ...csvRows].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=estudiantes_export.csv');
        res.status(200).send(csvString);

    } catch (error) {
        res.status(500).json({ message: 'Error al exportar estudiantes', error: error.message });
    }
};

module.exports = { getEstudiantes, createEstudiante, updateEstudiante, exportarEstudiantesCsv };
