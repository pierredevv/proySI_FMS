BEGIN;

-- Datos demo suficientes para probar dashboard, horarios, asistencia, pagos,
-- inventario, inscripciones, expedientes y consultas academicas basicas.

INSERT INTO gestion_academica (anio, fecha_inicio, fecha_fin, estado)
VALUES
    (2026, '2026-02-03', '2026-11-28', 'activa'),
    (2025, '2025-02-03', '2025-11-29', 'cerrada')
ON CONFLICT (anio) DO UPDATE
SET fecha_inicio = EXCLUDED.fecha_inicio,
    fecha_fin = EXCLUDED.fecha_fin,
    estado = EXCLUDED.estado;

INSERT INTO nivel (nombre_nivel, monto_mensualidad)
VALUES
    ('Inicial', 180.00),
    ('Primaria', 220.00),
    ('Secundaria', 260.00)
ON CONFLICT (nombre_nivel) DO UPDATE
SET monto_mensualidad = EXCLUDED.monto_mensualidad;

INSERT INTO grado (nombre_grado, id_nivel)
SELECT datos.nombre_grado, n.id_nivel
FROM (
    VALUES
        ('Kinder', 'Inicial'),
        ('1ro Primaria', 'Primaria'),
        ('2do Primaria', 'Primaria'),
        ('1ro Secundaria', 'Secundaria')
) AS datos(nombre_grado, nombre_nivel)
JOIN nivel n ON n.nombre_nivel = datos.nombre_nivel
ON CONFLICT (nombre_grado, id_nivel) DO NOTHING;

INSERT INTO aula (numero_aula, descripcion, cantidad_mesas, cantidad_sillas, capacidad_estudiantes)
VALUES
    ('A-101', 'Aula inicial con rincon de lectura', 14, 28, 28),
    ('A-102', 'Aula primaria equipada', 18, 36, 36),
    ('A-103', 'Aula primaria equipada', 18, 36, 36),
    ('B-201', 'Aula secundaria', 20, 40, 40)
ON CONFLICT (numero_aula) DO UPDATE
SET descripcion = EXCLUDED.descripcion,
    cantidad_mesas = EXCLUDED.cantidad_mesas,
    cantidad_sillas = EXCLUDED.cantidad_sillas,
    capacidad_estudiantes = EXCLUDED.capacidad_estudiantes;

INSERT INTO usuario (username, password_hash, id_rol, estado, email, intentos_fallidos)
VALUES
    ('prof_maria', '$2b$10$ozbyUS7L4A36HcnvDxzexuKX2YM1YDyQJt3xNraTyWW07Hkvz/VAy', 3, TRUE, 'maria.quiroga@local.test', 0),
    ('prof_carlos', '$2b$10$ozbyUS7L4A36HcnvDxzexuKX2YM1YDyQJt3xNraTyWW07Hkvz/VAy', 3, TRUE, 'carlos.rojas@local.test', 0),
    ('admin_demo', '$2b$10$ozbyUS7L4A36HcnvDxzexuKX2YM1YDyQJt3xNraTyWW07Hkvz/VAy', 4, TRUE, 'admin.demo@local.test', 0)
ON CONFLICT (username) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    id_rol = EXCLUDED.id_rol,
    estado = TRUE,
    email = EXCLUDED.email,
    intentos_fallidos = 0,
    bloqueado_hasta = NULL;

INSERT INTO profesor (id_usuario, nombre, apellido, ci, profesion, genero, estado)
SELECT u.id_usuario, datos.nombre, datos.apellido, datos.ci, datos.profesion, datos.genero, TRUE
FROM (
    VALUES
        ('prof_maria', 'Maria', 'Quiroga', 'PROF-1001', 'Lic. Educacion Primaria', 'Femenino'),
        ('prof_carlos', 'Carlos', 'Rojas', 'PROF-1002', 'Lic. Matematicas', 'Masculino')
) AS datos(username, nombre, apellido, ci, profesion, genero)
JOIN usuario u ON u.username = datos.username
ON CONFLICT (ci) DO UPDATE
SET id_usuario = EXCLUDED.id_usuario,
    nombre = EXCLUDED.nombre,
    apellido = EXCLUDED.apellido,
    profesion = EXCLUDED.profesion,
    genero = EXCLUDED.genero,
    estado = TRUE;

INSERT INTO campo_saber (nombre_campo, orden_visualizacion, descripcion)
VALUES
    ('Comunidad y Sociedad', 1, 'Lenguajes, ciencias sociales y expresiones culturales'),
    ('Ciencia Tecnologia y Produccion', 2, 'Matematicas, tecnica y tecnologia'),
    ('Vida Tierra Territorio', 3, 'Ciencias naturales y cuidado del entorno'),
    ('Cosmos y Pensamiento', 4, 'Valores, espiritualidad y convivencia')
ON CONFLICT (nombre_campo) DO UPDATE
SET orden_visualizacion = EXCLUDED.orden_visualizacion,
    descripcion = EXCLUDED.descripcion;

INSERT INTO materia (nombre_materia, descripcion, id_campo, aplica_primaria, estado)
SELECT datos.nombre_materia, datos.descripcion, c.id_campo, datos.aplica_primaria, TRUE
FROM (
    VALUES
        ('Lenguaje', 'Lectura, escritura y comunicacion', 'Comunidad y Sociedad', TRUE),
        ('Matematicas', 'Numeros, operaciones y resolucion de problemas', 'Ciencia Tecnologia y Produccion', TRUE),
        ('Ciencias Naturales', 'Observacion del entorno y vida saludable', 'Vida Tierra Territorio', TRUE),
        ('Valores', 'Convivencia, responsabilidad y respeto', 'Cosmos y Pensamiento', TRUE)
) AS datos(nombre_materia, descripcion, nombre_campo, aplica_primaria)
JOIN campo_saber c ON c.nombre_campo = datos.nombre_campo
WHERE NOT EXISTS (
    SELECT 1 FROM materia m WHERE m.nombre_materia = datos.nombre_materia
);

WITH refs AS (
    SELECT
        ga.id_gestion,
        p1.id_profesor AS prof_maria,
        p2.id_profesor AS prof_carlos,
        gk.id_grado AS grado_kinder,
        g1.id_grado AS grado_1p,
        g2.id_grado AS grado_2p,
        a101.id_aula AS aula_101,
        a102.id_aula AS aula_102,
        a103.id_aula AS aula_103
    FROM gestion_academica ga
    JOIN profesor p1 ON p1.ci = 'PROF-1001'
    JOIN profesor p2 ON p2.ci = 'PROF-1002'
    JOIN grado gk ON gk.nombre_grado = 'Kinder'
    JOIN nivel nk ON nk.id_nivel = gk.id_nivel AND nk.nombre_nivel = 'Inicial'
    JOIN grado g1 ON g1.nombre_grado = '1ro Primaria'
    JOIN nivel n1 ON n1.id_nivel = g1.id_nivel AND n1.nombre_nivel = 'Primaria'
    JOIN grado g2 ON g2.nombre_grado = '2do Primaria'
    JOIN nivel n2 ON n2.id_nivel = g2.id_nivel AND n2.nombre_nivel = 'Primaria'
    JOIN aula a101 ON a101.numero_aula = 'A-101'
    JOIN aula a102 ON a102.numero_aula = 'A-102'
    JOIN aula a103 ON a103.numero_aula = 'A-103'
    WHERE ga.anio = 2026
)
INSERT INTO curso (id_grado, paralelo, id_aula, id_gestion, id_profesor, turno, estado)
SELECT grado_kinder, 'A', aula_101, id_gestion, prof_maria, 'Tarde', TRUE FROM refs
UNION ALL
SELECT grado_1p, 'A', aula_102, id_gestion, prof_maria, 'Mañana', TRUE FROM refs
UNION ALL
SELECT grado_2p, 'A', aula_103, id_gestion, prof_carlos, 'Mañana', TRUE FROM refs
ON CONFLICT (id_grado, paralelo, id_gestion, turno) DO UPDATE
SET id_aula = EXCLUDED.id_aula,
    id_profesor = EXCLUDED.id_profesor,
    estado = TRUE;

INSERT INTO curso_materia (id_curso, id_materia, id_profesor)
SELECT c.id_curso, m.id_materia,
       CASE WHEN m.nombre_materia = 'Matematicas' THEN pc.id_profesor ELSE pm.id_profesor END
FROM curso c
JOIN gestion_academica ga ON ga.id_gestion = c.id_gestion AND ga.anio = 2026
JOIN grado g ON g.id_grado = c.id_grado
JOIN materia m ON m.nombre_materia IN ('Lenguaje', 'Matematicas', 'Ciencias Naturales', 'Valores')
JOIN profesor pm ON pm.ci = 'PROF-1001'
JOIN profesor pc ON pc.ci = 'PROF-1002'
WHERE (g.nombre_grado, c.paralelo) IN (('Kinder', 'A'), ('1ro Primaria', 'A'), ('2do Primaria', 'A'))
ON CONFLICT (id_curso, id_materia) DO UPDATE
SET id_profesor = EXCLUDED.id_profesor;

INSERT INTO estudiante (nombre, apellido, ci, fecha_nacimiento, genero, estado, observaciones)
VALUES
    ('Sofia', 'Mamani', 'EST-2001', '2018-04-12', 'Femenino', 'activo', 'Demo: estudiante de primero A'),
    ('Lucas', 'Flores', 'EST-2002', '2018-09-03', 'Masculino', 'activo', 'Demo: estudiante de primero A'),
    ('Camila', 'Vargas', 'EST-2003', '2017-02-22', 'Femenino', 'activo', 'Demo: estudiante de segundo A'),
    ('Diego', 'Choque', 'EST-2004', '2017-07-18', 'Masculino', 'activo', 'Demo: estudiante de segundo A'),
    ('Valentina', 'Cruz', 'EST-2005', '2020-01-15', 'Femenino', 'activo', 'Demo: estudiante de kinder A')
ON CONFLICT (ci) DO UPDATE
SET nombre = EXCLUDED.nombre,
    apellido = EXCLUDED.apellido,
    fecha_nacimiento = EXCLUDED.fecha_nacimiento,
    genero = EXCLUDED.genero,
    estado = EXCLUDED.estado,
    observaciones = EXCLUDED.observaciones;

INSERT INTO tutor (nombre, apellido, ci, genero, telefono, correo_electronico, direccion)
VALUES
    ('Ana', 'Mamani', 'TUT-3001', 'Femenino', '70010001', 'ana.mamani@local.test', 'Zona Central 123'),
    ('Jorge', 'Flores', 'TUT-3002', 'Masculino', '70010002', 'jorge.flores@local.test', 'Av. Libertad 45'),
    ('Patricia', 'Vargas', 'TUT-3003', 'Femenino', '70010003', 'patricia.vargas@local.test', 'Barrio Norte 89'),
    ('Roberto', 'Choque', 'TUT-3004', 'Masculino', '70010004', 'roberto.choque@local.test', 'Calle Comercio 77'),
    ('Elena', 'Cruz', 'TUT-3005', 'Femenino', '70010005', 'elena.cruz@local.test', 'Zona Sur 321')
ON CONFLICT (ci) DO UPDATE
SET nombre = EXCLUDED.nombre,
    apellido = EXCLUDED.apellido,
    genero = EXCLUDED.genero,
    telefono = EXCLUDED.telefono,
    correo_electronico = EXCLUDED.correo_electronico,
    direccion = EXCLUDED.direccion;

INSERT INTO tutor_estudiante (id_tutor, id_estudiante, parentesco, autorizado_recoger, contacto_emergencia)
SELECT t.id_tutor, e.id_estudiante, datos.parentesco, TRUE, TRUE
FROM (
    VALUES
        ('TUT-3001', 'EST-2001', 'Madre'),
        ('TUT-3002', 'EST-2002', 'Padre'),
        ('TUT-3003', 'EST-2003', 'Madre'),
        ('TUT-3004', 'EST-2004', 'Padre'),
        ('TUT-3005', 'EST-2005', 'Madre')
) AS datos(ci_tutor, ci_estudiante, parentesco)
JOIN tutor t ON t.ci = datos.ci_tutor
JOIN estudiante e ON e.ci = datos.ci_estudiante
ON CONFLICT (id_tutor, id_estudiante) DO UPDATE
SET parentesco = EXCLUDED.parentesco,
    autorizado_recoger = TRUE,
    contacto_emergencia = TRUE;

INSERT INTO inscripcion (id_estudiante, id_curso, fecha_inscripcion, estado, observaciones)
SELECT e.id_estudiante, c.id_curso, '2026-02-05', 'inscrito', 'Inscripcion demo 2026'
FROM (
    VALUES
        ('EST-2001', '1ro Primaria'),
        ('EST-2002', '1ro Primaria'),
        ('EST-2003', '2do Primaria'),
        ('EST-2004', '2do Primaria'),
        ('EST-2005', 'Kinder')
) AS datos(ci_estudiante, nombre_grado)
JOIN estudiante e ON e.ci = datos.ci_estudiante
JOIN grado g ON g.nombre_grado = datos.nombre_grado
JOIN curso c ON c.id_grado = g.id_grado AND c.paralelo = 'A'
JOIN gestion_academica ga ON ga.id_gestion = c.id_gestion AND ga.anio = 2026
WHERE NOT EXISTS (
    SELECT 1
    FROM inscripcion i
    JOIN curso ci ON ci.id_curso = i.id_curso
    WHERE i.id_estudiante = e.id_estudiante
      AND ci.id_gestion = ga.id_gestion
      AND i.estado = 'inscrito'
);

INSERT INTO horario (id_curso, id_materia, dia_semana, hora_inicio, hora_fin, actividad, publicado)
SELECT c.id_curso, m.id_materia, datos.dia_semana, datos.hora_inicio::time, datos.hora_fin::time, datos.actividad, TRUE
FROM (
    VALUES
        ('1ro Primaria', 'A', 'Lenguaje', 'lunes', '08:00', '08:45', 'Lectura guiada'),
        ('1ro Primaria', 'A', 'Matematicas', 'lunes', '08:45', '09:30', 'Numeros y conteo'),
        ('1ro Primaria', 'A', 'Ciencias Naturales', 'martes', '08:00', '08:45', 'El entorno'),
        ('2do Primaria', 'A', 'Matematicas', 'lunes', '08:00', '08:45', 'Operaciones basicas'),
        ('2do Primaria', 'A', 'Lenguaje', 'martes', '08:45', '09:30', 'Comprension lectora'),
        ('Kinder', 'A', 'Valores', 'lunes', '14:00', '14:45', 'Convivencia'),
        ('Kinder', 'A', 'Lenguaje', 'martes', '14:00', '14:45', 'Cuentos y canciones')
) AS datos(nombre_grado, paralelo, nombre_materia, dia_semana, hora_inicio, hora_fin, actividad)
JOIN grado g ON g.nombre_grado = datos.nombre_grado
JOIN curso c ON c.id_grado = g.id_grado AND c.paralelo = datos.paralelo
JOIN gestion_academica ga ON ga.id_gestion = c.id_gestion AND ga.anio = 2026
JOIN materia m ON m.nombre_materia = datos.nombre_materia
WHERE NOT EXISTS (
    SELECT 1
    FROM horario h
    WHERE h.id_curso = c.id_curso
      AND h.dia_semana = datos.dia_semana
      AND h.hora_inicio = datos.hora_inicio::time
      AND h.hora_fin = datos.hora_fin::time
);

INSERT INTO asistencia (id_estudiante, id_curso, fecha, estado, observaciones, id_usuario_registro)
SELECT e.id_estudiante, c.id_curso, datos.fecha::date, datos.estado, datos.observaciones, u.id_usuario
FROM (
    VALUES
        ('EST-2001', '1ro Primaria', '2026-05-04', 'P', NULL),
        ('EST-2002', '1ro Primaria', '2026-05-04', 'T', 'Llego 10 minutos tarde'),
        ('EST-2003', '2do Primaria', '2026-05-04', 'P', NULL),
        ('EST-2004', '2do Primaria', '2026-05-04', 'A', 'Sin justificativo'),
        ('EST-2005', 'Kinder', '2026-05-04', 'J', 'Cita medica')
) AS datos(ci_estudiante, nombre_grado, fecha, estado, observaciones)
JOIN estudiante e ON e.ci = datos.ci_estudiante
JOIN grado g ON g.nombre_grado = datos.nombre_grado
JOIN curso c ON c.id_grado = g.id_grado AND c.paralelo = 'A'
JOIN gestion_academica ga ON ga.id_gestion = c.id_gestion AND ga.anio = 2026
JOIN usuario u ON u.username = 'admin_demo'
ON CONFLICT (id_estudiante, id_curso, fecha) DO UPDATE
SET estado = EXCLUDED.estado,
    observaciones = EXCLUDED.observaciones,
    id_usuario_registro = EXCLUDED.id_usuario_registro;

INSERT INTO deuda (id_estudiante, id_gestion, id_concepto, monto, mes, estado)
SELECT e.id_estudiante, ga.id_gestion, cp.id_concepto, datos.monto, datos.mes, datos.estado
FROM (
    VALUES
        ('EST-2001', 'Mensualidad', 220.00, 'Mayo', 'pendiente'),
        ('EST-2002', 'Mensualidad', 220.00, 'Mayo', 'pendiente'),
        ('EST-2003', 'Mensualidad', 220.00, 'Abril', 'pendiente'),
        ('EST-2004', 'Inscripcion', 150.00, 'Febrero', 'mora'),
        ('EST-2005', 'Mensualidad', 180.00, 'Mayo', 'pendiente')
) AS datos(ci_estudiante, nombre_concepto, monto, mes, estado)
JOIN estudiante e ON e.ci = datos.ci_estudiante
JOIN gestion_academica ga ON ga.anio = 2026
JOIN concepto_pago cp ON cp.nombre_concepto = datos.nombre_concepto
ON CONFLICT (id_estudiante, id_gestion, id_concepto, mes) DO UPDATE
SET monto = EXCLUDED.monto,
    estado = EXCLUDED.estado;

INSERT INTO pago (id_deuda, id_estudiante, monto_pagado, metodo_pago, comprobante_url, estado, id_usuario_registro, fecha_pago, observaciones)
SELECT d.id_deuda, d.id_estudiante, d.monto, 'efectivo', NULL, 'validado', u.id_usuario, '2026-05-04 10:15:00', 'Pago demo validado'
FROM deuda d
JOIN estudiante e ON e.id_estudiante = d.id_estudiante AND e.ci = 'EST-2003'
JOIN concepto_pago cp ON cp.id_concepto = d.id_concepto AND cp.nombre_concepto = 'Mensualidad'
JOIN gestion_academica ga ON ga.id_gestion = d.id_gestion AND ga.anio = 2026
JOIN usuario u ON u.username = 'admin_demo'
WHERE d.mes = 'Abril'
  AND NOT EXISTS (
      SELECT 1 FROM pago p WHERE p.id_deuda = d.id_deuda AND p.observaciones = 'Pago demo validado'
  );

UPDATE deuda d
SET estado = 'pagado'
FROM estudiante e, concepto_pago cp, gestion_academica ga
WHERE d.id_estudiante = e.id_estudiante
  AND d.id_concepto = cp.id_concepto
  AND d.id_gestion = ga.id_gestion
  AND e.ci = 'EST-2003'
  AND cp.nombre_concepto = 'Mensualidad'
  AND ga.anio = 2026
  AND d.mes = 'Abril';

INSERT INTO pago (id_deuda, id_estudiante, monto_pagado, metodo_pago, comprobante_url, estado, id_usuario_registro, fecha_pago, observaciones)
SELECT d.id_deuda, d.id_estudiante, 100.00, 'QR', 'demo/qr-pendiente.png', 'pendiente_validacion', u.id_usuario, '2026-05-05 09:30:00', 'Pago demo pendiente de validacion'
FROM deuda d
JOIN estudiante e ON e.id_estudiante = d.id_estudiante AND e.ci = 'EST-2002'
JOIN concepto_pago cp ON cp.id_concepto = d.id_concepto AND cp.nombre_concepto = 'Mensualidad'
JOIN gestion_academica ga ON ga.id_gestion = d.id_gestion AND ga.anio = 2026
JOIN usuario u ON u.username = 'admin_demo'
WHERE d.mes = 'Mayo'
  AND NOT EXISTS (
      SELECT 1 FROM pago p WHERE p.id_deuda = d.id_deuda AND p.observaciones = 'Pago demo pendiente de validacion'
  );

INSERT INTO movimiento_inventario (id_material, tipo_movimiento, cantidad, id_usuario, observaciones)
SELECT m.id_material, datos.tipo_movimiento, datos.cantidad, u.id_usuario, datos.observaciones
FROM (
    VALUES
        ('Cuadernos rayados 100 hojas', 'entrada', 120, 'Carga demo: cuadernos'),
        ('Lapices HB', 'entrada', 250, 'Carga demo: lapices'),
        ('Tizas blancas', 'entrada', 60, 'Carga demo: tizas'),
        ('Sillas escolares', 'entrada', 35, 'Carga demo: sillas'),
        ('Mesas escolares', 'entrada', 20, 'Carga demo: mesas'),
        ('Cuadernos rayados 100 hojas', 'salida', 12, 'Entrega demo a 1ro A')
) AS datos(nombre_item, tipo_movimiento, cantidad, observaciones)
JOIN material m ON m.nombre_item = datos.nombre_item
JOIN usuario u ON u.username = 'admin_demo'
WHERE NOT EXISTS (
    SELECT 1
    FROM movimiento_inventario mi
    WHERE mi.id_material = m.id_material
      AND mi.observaciones = datos.observaciones
);

INSERT INTO dimension_evaluacion (nombre_dimension, puntaje_maximo, id_gestion)
SELECT datos.nombre_dimension, datos.puntaje_maximo, ga.id_gestion
FROM (
    VALUES
        ('Ser', 10.00),
        ('Saber', 35.00),
        ('Hacer', 35.00),
        ('Autoevaluacion', 10.00)
) AS datos(nombre_dimension, puntaje_maximo)
JOIN gestion_academica ga ON ga.anio = 2026
ON CONFLICT (nombre_dimension, id_gestion) DO UPDATE
SET puntaje_maximo = EXCLUDED.puntaje_maximo;

INSERT INTO actividad_evaluacion (id_curso_materia, id_dimension_eval, trimestre, nombre_actividad, fecha_actividad)
SELECT cm.id_curso_materia, de.id_dimension_eval, 1, 'Practica demo de lectura', '2026-04-15'
FROM curso_materia cm
JOIN curso c ON c.id_curso = cm.id_curso
JOIN grado g ON g.id_grado = c.id_grado AND g.nombre_grado = '1ro Primaria'
JOIN gestion_academica ga ON ga.id_gestion = c.id_gestion AND ga.anio = 2026
JOIN materia m ON m.id_materia = cm.id_materia AND m.nombre_materia = 'Lenguaje'
JOIN dimension_evaluacion de ON de.id_gestion = ga.id_gestion AND de.nombre_dimension = 'Saber'
WHERE NOT EXISTS (
    SELECT 1 FROM actividad_evaluacion ae
    WHERE ae.id_curso_materia = cm.id_curso_materia
      AND ae.trimestre = 1
      AND ae.nombre_actividad = 'Practica demo de lectura'
);

INSERT INTO calificacion (id_actividad, id_estudiante, nota, fecha_evaluacion, observaciones)
SELECT ae.id_actividad, e.id_estudiante, datos.nota, '2026-04-16', 'Calificacion demo'
FROM (
    VALUES
        ('EST-2001', 31.00),
        ('EST-2002', 28.00)
) AS datos(ci_estudiante, nota)
JOIN estudiante e ON e.ci = datos.ci_estudiante
JOIN actividad_evaluacion ae ON ae.nombre_actividad = 'Practica demo de lectura'
JOIN curso_materia cm ON cm.id_curso_materia = ae.id_curso_materia
JOIN curso c ON c.id_curso = cm.id_curso
JOIN grado g ON g.id_grado = c.id_grado AND g.nombre_grado = '1ro Primaria'
JOIN gestion_academica ga ON ga.id_gestion = c.id_gestion AND ga.anio = 2026
ON CONFLICT (id_actividad, id_estudiante) DO UPDATE
SET nota = EXCLUDED.nota,
    fecha_evaluacion = EXCLUDED.fecha_evaluacion,
    observaciones = EXCLUDED.observaciones;

INSERT INTO aviso (titulo, contenido, id_usuario, destinatario_tipo, id_curso_destino, fecha_envio, estado)
SELECT 'Reunion de padres demo',
       'Se convoca a reunion informativa para revisar avance academico.',
       u.id_usuario,
       'por_curso',
       c.id_curso,
       '2026-05-06 08:00:00',
       'enviado'
FROM usuario u
JOIN gestion_academica ga ON ga.anio = 2026
JOIN grado g ON g.nombre_grado = '1ro Primaria'
JOIN curso c ON c.id_grado = g.id_grado AND c.paralelo = 'A' AND c.id_gestion = ga.id_gestion
WHERE u.username = 'admin_demo'
  AND NOT EXISTS (
      SELECT 1 FROM aviso a
      WHERE a.titulo = 'Reunion de padres demo'
        AND a.id_curso_destino = c.id_curso
  );

INSERT INTO notificacion (id_aviso, id_tutor, canal, estado_envio, fecha_envio)
SELECT a.id_aviso, t.id_tutor, 'whatsapp', 'enviado', '2026-05-06 08:02:00'
FROM aviso a
JOIN tutor_estudiante te ON te.id_estudiante IN (
    SELECT i.id_estudiante
    FROM inscripcion i
    WHERE i.id_curso = a.id_curso_destino
      AND i.estado = 'inscrito'
)
JOIN tutor t ON t.id_tutor = te.id_tutor
WHERE a.titulo = 'Reunion de padres demo'
  AND NOT EXISTS (
      SELECT 1 FROM notificacion n
      WHERE n.id_aviso = a.id_aviso
        AND n.id_tutor = t.id_tutor
        AND n.canal = 'whatsapp'
  );

INSERT INTO entrega_estudiante (id_estudiante, id_tutor, id_usuario_supervisor, fecha_hora_entrega, observaciones)
SELECT e.id_estudiante, t.id_tutor, u.id_usuario, '2026-05-04 12:20:00', 'Entrega demo autorizada'
FROM estudiante e
JOIN tutor_estudiante te ON te.id_estudiante = e.id_estudiante AND te.autorizado_recoger = TRUE
JOIN tutor t ON t.id_tutor = te.id_tutor
JOIN usuario u ON u.username = 'admin_demo'
WHERE e.ci = 'EST-2001'
  AND NOT EXISTS (
      SELECT 1 FROM entrega_estudiante ee
      WHERE ee.id_estudiante = e.id_estudiante
        AND ee.id_tutor = t.id_tutor
        AND ee.observaciones = 'Entrega demo autorizada'
  );

COMMIT;
