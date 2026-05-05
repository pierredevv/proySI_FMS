-- Alinea modulos reales de asistencia, pagos e inventario.
-- Idempotente: se puede ejecutar varias veces.

BEGIN;

INSERT INTO modulo (nombre_modulo, descripcion)
VALUES
    ('asistencias', 'Control de asistencia estudiantil'),
    ('pagos', 'Gestion financiera'),
    ('inventario', 'Gestion de inventario')
ON CONFLICT (nombre_modulo) DO UPDATE
SET descripcion = EXCLUDED.descripcion,
    estado = TRUE;

INSERT INTO permiso (nombre_permiso, descripcion)
VALUES
    ('registrar_asistencia', 'Registrar asistencia estudiantil'),
    ('ver_asistencias', 'Consultar asistencia estudiantil'),
    ('gestionar_pagos', 'Gestionar pagos y deudas'),
    ('ver_pagos', 'Consultar pagos'),
    ('gestionar_inventario', 'Gestionar inventario escolar'),
    ('ver_inventario', 'Consultar inventario escolar')
ON CONFLICT (nombre_permiso) DO UPDATE
SET descripcion = EXCLUDED.descripcion;

CREATE TABLE IF NOT EXISTS rol_funcionalidad (
    id_rol INTEGER NOT NULL REFERENCES rol(id_rol) ON DELETE CASCADE,
    id_funcionalidad INTEGER NOT NULL REFERENCES funcionalidad(id_funcionalidad) ON DELETE CASCADE,
    fecha_asignacion TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_rol, id_funcionalidad)
);

INSERT INTO funcionalidad (metodo, descripcion, id_permiso, id_modulo)
SELECT datos.metodo, datos.descripcion, p.id_permiso, m.id_modulo
FROM (
    VALUES
        ('GET /api/asistencias/cursos', 'Listar cursos para asistencia', 'ver_asistencias', 'asistencias'),
        ('GET /api/asistencias/curso/:id_curso', 'Consultar asistencia por curso y fecha', 'ver_asistencias', 'asistencias'),
        ('POST /api/asistencias/curso/:id_curso', 'Registrar asistencia por curso y fecha', 'registrar_asistencia', 'asistencias'),
        ('GET /api/pagos/conceptos', 'Listar conceptos de pago', 'ver_pagos', 'pagos'),
        ('POST /api/pagos/conceptos', 'Crear conceptos de pago', 'gestionar_pagos', 'pagos'),
        ('GET /api/pagos/deudas', 'Listar deudas y pagos', 'ver_pagos', 'pagos'),
        ('POST /api/pagos/deudas', 'Generar deudas', 'gestionar_pagos', 'pagos'),
        ('POST /api/pagos', 'Registrar pagos', 'gestionar_pagos', 'pagos'),
        ('PUT /api/pagos/:id/estado', 'Validar o rechazar pagos', 'gestionar_pagos', 'pagos'),
        ('GET /api/inventario/materiales', 'Listar materiales', 'ver_inventario', 'inventario'),
        ('POST /api/inventario/materiales', 'Crear materiales', 'gestionar_inventario', 'inventario'),
        ('PUT /api/inventario/materiales/:id', 'Actualizar materiales', 'gestionar_inventario', 'inventario'),
        ('GET /api/inventario/movimientos', 'Listar movimientos de inventario', 'ver_inventario', 'inventario'),
        ('POST /api/inventario/movimientos', 'Registrar movimientos de inventario', 'gestionar_inventario', 'inventario')
) AS datos(metodo, descripcion, nombre_permiso, nombre_modulo)
JOIN permiso p ON p.nombre_permiso = datos.nombre_permiso
JOIN modulo m ON m.nombre_modulo = datos.nombre_modulo
ON CONFLICT (metodo, id_permiso, id_modulo) DO UPDATE
SET descripcion = EXCLUDED.descripcion,
    estado = TRUE;

INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM (
    VALUES
        ('SuperUsuario', 'registrar_asistencia'),
        ('SuperUsuario', 'ver_asistencias'),
        ('SuperUsuario', 'gestionar_pagos'),
        ('SuperUsuario', 'ver_pagos'),
        ('SuperUsuario', 'gestionar_inventario'),
        ('SuperUsuario', 'ver_inventario'),
        ('Director', 'registrar_asistencia'),
        ('Director', 'ver_asistencias'),
        ('Director', 'gestionar_pagos'),
        ('Director', 'ver_pagos'),
        ('Director', 'gestionar_inventario'),
        ('Director', 'ver_inventario'),
        ('Profesor', 'registrar_asistencia'),
        ('Profesor', 'ver_asistencias'),
        ('Administrativo', 'gestionar_pagos'),
        ('Administrativo', 'ver_pagos'),
        ('Administrativo', 'gestionar_inventario'),
        ('Administrativo', 'ver_inventario')
) AS datos(nombre_rol, nombre_permiso)
JOIN rol r ON r.nombre_rol = datos.nombre_rol
JOIN permiso p ON p.nombre_permiso = datos.nombre_permiso
ON CONFLICT (id_rol, id_permiso) DO NOTHING;

INSERT INTO rol_funcionalidad (id_rol, id_funcionalidad)
SELECT DISTINCT rp.id_rol, f.id_funcionalidad
FROM rol_permiso rp
JOIN funcionalidad f ON f.id_permiso = rp.id_permiso
WHERE f.estado = TRUE
ON CONFLICT (id_rol, id_funcionalidad) DO NOTHING;

INSERT INTO concepto_pago (nombre_concepto, descripcion)
VALUES
    ('Inscripcion', 'Pago anual de inscripcion'),
    ('Mensualidad', 'Pago mensual por nivel educativo'),
    ('Material escolar', 'Pago por materiales escolares'),
    ('Uniforme', 'Pago por uniforme institucional')
ON CONFLICT (nombre_concepto) DO UPDATE
SET descripcion = EXCLUDED.descripcion;

INSERT INTO material (nombre_item, descripcion, categoria, stock_actual, stock_minimo)
SELECT datos.nombre_item, datos.descripcion, datos.categoria, datos.stock_actual, datos.stock_minimo
FROM (
    VALUES
        ('Cuadernos rayados 100 hojas', 'Cuadernos para uso escolar', 'Material escolar', 0, 50),
        ('Lapices HB', 'Lapices de grafito para aula', 'Material escolar', 0, 100),
        ('Tizas blancas', 'Caja de tizas blancas', 'Material escolar', 0, 20),
        ('Sillas escolares', 'Mobiliario para aulas', 'Mobiliario', 0, 20),
        ('Mesas escolares', 'Mobiliario para aulas', 'Mobiliario', 0, 20)
) AS datos(nombre_item, descripcion, categoria, stock_actual, stock_minimo)
WHERE NOT EXISTS (
    SELECT 1 FROM material m WHERE m.nombre_item = datos.nombre_item
);

COMMIT;
