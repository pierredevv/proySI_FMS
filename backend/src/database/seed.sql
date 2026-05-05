-- Datos minimos para levantar el sistema en una base nueva.
-- Usuario inicial: superuser / Admin123!@#

BEGIN;

INSERT INTO rol (id_rol, nombre_rol, descripcion, estado)
VALUES
    (1, 'SuperUsuario', 'Acceso total al sistema', TRUE),
    (2, 'Director', 'Acceso a todos los modulos', TRUE),
    (3, 'Profesor', 'Gestion de asistencias y evaluaciones', TRUE),
    (4, 'Administrativo', 'Gestion administrativa, pagos e inventario', TRUE)
ON CONFLICT (id_rol) DO UPDATE
SET nombre_rol = EXCLUDED.nombre_rol,
    descripcion = EXCLUDED.descripcion,
    estado = EXCLUDED.estado;

SELECT setval('rol_id_rol_seq', GREATEST((SELECT MAX(id_rol) FROM rol), 1), TRUE);

INSERT INTO permiso (nombre_permiso, descripcion)
VALUES
    ('ver_dashboard', 'Ver panel principal'),
    ('gestionar_usuarios', 'Crear, editar y eliminar usuarios'),
    ('gestionar_roles', 'Crear y eliminar roles'),
    ('ver_bitacora', 'Consultar bitacora de auditoria del sistema'),
    ('gestionar_estructura', 'Gestionar aulas, niveles y grados'),
    ('gestionar_cursos', 'Crear, consultar y actualizar cursos'),
    ('gestionar_materias', 'Crear, consultar y actualizar materias'),
    ('asignar_materias', 'Asignar materias y profesores a cursos'),
    ('gestionar_horarios', 'Crear, editar y publicar horarios'),
    ('gestionar_estudiantes', 'Registrar y actualizar estudiantes'),
    ('ver_estudiantes', 'Consultar estudiantes'),
    ('gestionar_tutores', 'Crear, consultar y actualizar tutores'),
    ('gestionar_inscripciones', 'Inscribir, retirar y trasladar estudiantes'),
    ('consultar_expedientes', 'Consultar expedientes digitales de estudiantes'),
    ('registrar_asistencia', 'Registrar asistencia estudiantil'),
    ('ver_asistencias', 'Consultar asistencia estudiantil'),
    ('gestionar_evaluaciones', 'Gestionar actividades y calificaciones'),
    ('ver_evaluaciones', 'Consultar evaluaciones'),
    ('gestionar_pagos', 'Gestionar pagos y deudas'),
    ('ver_pagos', 'Consultar pagos'),
    ('gestionar_inventario', 'Gestionar inventario escolar'),
    ('ver_inventario', 'Consultar inventario escolar'),
    ('registrar_entregas', 'Registrar entregas de estudiantes'),
    ('ver_entregas', 'Consultar entregas de estudiantes'),
    ('publicar_avisos', 'Publicar avisos y notificaciones'),
    ('ver_reportes', 'Consultar reportes')
ON CONFLICT (nombre_permiso) DO UPDATE
SET descripcion = EXCLUDED.descripcion;

INSERT INTO modulo (nombre_modulo, descripcion)
VALUES
    ('general', 'Acceso general al sistema'),
    ('usuarios', 'Gestion de usuarios, roles y permisos'),
    ('seguridad', 'Auditoria, permisos y bitacora del sistema'),
    ('estructura', 'Gestion de aulas, niveles y grados'),
    ('academico', 'Gestion academica: cursos, materias y horarios'),
    ('estudiantes', 'Gestion de estudiantes, tutores e inscripciones'),
    ('expedientes', 'Consulta de expedientes digitales'),
    ('asistencias', 'Control de asistencia estudiantil'),
    ('evaluaciones', 'Evaluaciones y calificaciones'),
    ('pagos', 'Gestion financiera'),
    ('inventario', 'Gestion de inventario'),
    ('entregas', 'Entrega segura de estudiantes'),
    ('comunicacion', 'Avisos y notificaciones'),
    ('reportes', 'Reportes institucionales')
ON CONFLICT (nombre_modulo) DO UPDATE
SET descripcion = EXCLUDED.descripcion;

INSERT INTO funcionalidad (metodo, descripcion, id_permiso, id_modulo)
SELECT datos.metodo, datos.descripcion, p.id_permiso, m.id_modulo
FROM (
    VALUES
        ('GET /api/auth/me', 'Validar sesion', 'ver_dashboard', 'general'),
        ('GET /api/users', 'Listar usuarios', 'gestionar_usuarios', 'usuarios'),
        ('POST /api/users', 'Crear usuarios', 'gestionar_usuarios', 'usuarios'),
        ('PUT /api/users/:id', 'Actualizar usuarios', 'gestionar_usuarios', 'usuarios'),
        ('DELETE /api/users/:id', 'Eliminar usuarios', 'gestionar_usuarios', 'usuarios'),
        ('GET /api/roles', 'Listar roles', 'gestionar_roles', 'usuarios'),
        ('POST /api/roles', 'Crear roles', 'gestionar_roles', 'usuarios'),
        ('DELETE /api/roles/:id', 'Eliminar roles', 'gestionar_roles', 'usuarios'),
        ('GET /api/bitacora', 'Consultar bitacora', 'ver_bitacora', 'seguridad'),
        ('GET /api/bitacora/filtros', 'Consultar filtros de bitacora', 'ver_bitacora', 'seguridad'),
        ('GET /api/seguridad/modulos-funcionalidades', 'Consultar modulos y funcionalidades', 'gestionar_roles', 'seguridad'),
        ('POST /api/auth/login', 'Registrar inicio de sesion', 'ver_bitacora', 'seguridad'),
        ('POST /api/auth/logout', 'Registrar cierre de sesion', 'ver_bitacora', 'seguridad'),
        ('GET /api/estructura/*', 'Consultar estructura educativa', 'gestionar_estructura', 'estructura'),
        ('POST /api/estructura/*', 'Crear estructura educativa', 'gestionar_estructura', 'estructura'),
        ('PUT /api/estructura/*', 'Actualizar estructura educativa', 'gestionar_estructura', 'estructura'),
        ('GET /api/curso/*', 'Consultar cursos', 'gestionar_cursos', 'academico'),
        ('POST /api/curso/*', 'Crear cursos', 'gestionar_cursos', 'academico'),
        ('PUT /api/curso/*', 'Actualizar cursos', 'gestionar_cursos', 'academico'),
        ('GET /api/materias/*', 'Consultar materias', 'gestionar_materias', 'academico'),
        ('POST /api/materias/*', 'Crear materias', 'gestionar_materias', 'academico'),
        ('GET /api/materia-asig/*', 'Consultar asignaciones', 'asignar_materias', 'academico'),
        ('POST /api/materia-asig/*', 'Asignar materias', 'asignar_materias', 'academico'),
        ('GET /api/horarios/*', 'Consultar horarios', 'gestionar_horarios', 'academico'),
        ('POST /api/horarios', 'Crear bloques de horario', 'gestionar_horarios', 'academico'),
        ('PUT /api/horarios/:id', 'Editar bloques de horario', 'gestionar_horarios', 'academico'),
        ('GET /api/asistencias/cursos', 'Listar cursos para asistencia', 'ver_asistencias', 'asistencias'),
        ('GET /api/asistencias/curso/:id_curso', 'Consultar asistencia por curso y fecha', 'ver_asistencias', 'asistencias'),
        ('POST /api/asistencias/curso/:id_curso', 'Registrar asistencia por curso y fecha', 'registrar_asistencia', 'asistencias'),
        ('GET /api/estudiantes/*', 'Consultar estudiantes', 'ver_estudiantes', 'estudiantes'),
        ('POST /api/estudiantes', 'Registrar estudiantes', 'gestionar_estudiantes', 'estudiantes'),
        ('PUT /api/estudiantes/:id', 'Actualizar estudiantes', 'gestionar_estudiantes', 'estudiantes'),
        ('GET /api/tutores/*', 'Consultar tutores', 'gestionar_tutores', 'estudiantes'),
        ('POST /api/tutores', 'Registrar tutores', 'gestionar_tutores', 'estudiantes'),
        ('POST /api/inscripciones', 'Inscribir estudiantes', 'gestionar_inscripciones', 'estudiantes'),
        ('PUT /api/inscripciones/*', 'Retirar o trasladar estudiantes', 'gestionar_inscripciones', 'estudiantes'),
        ('GET /api/expedientes/:id', 'Consultar expediente', 'consultar_expedientes', 'expedientes'),
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
ON CONFLICT DO NOTHING;

INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM (
    VALUES
        ('SuperUsuario', 'ver_dashboard'),
        ('SuperUsuario', 'gestionar_usuarios'),
        ('SuperUsuario', 'gestionar_roles'),
        ('SuperUsuario', 'ver_bitacora'),
        ('SuperUsuario', 'gestionar_estructura'),
        ('SuperUsuario', 'gestionar_cursos'),
        ('SuperUsuario', 'gestionar_materias'),
        ('SuperUsuario', 'asignar_materias'),
        ('SuperUsuario', 'gestionar_horarios'),
        ('SuperUsuario', 'gestionar_estudiantes'),
        ('SuperUsuario', 'ver_estudiantes'),
        ('SuperUsuario', 'gestionar_tutores'),
        ('SuperUsuario', 'gestionar_inscripciones'),
        ('SuperUsuario', 'consultar_expedientes'),
        ('SuperUsuario', 'registrar_asistencia'),
        ('SuperUsuario', 'ver_asistencias'),
        ('SuperUsuario', 'gestionar_evaluaciones'),
        ('SuperUsuario', 'ver_evaluaciones'),
        ('SuperUsuario', 'gestionar_pagos'),
        ('SuperUsuario', 'ver_pagos'),
        ('SuperUsuario', 'gestionar_inventario'),
        ('SuperUsuario', 'ver_inventario'),
        ('SuperUsuario', 'registrar_entregas'),
        ('SuperUsuario', 'ver_entregas'),
        ('SuperUsuario', 'publicar_avisos'),
        ('SuperUsuario', 'ver_reportes'),
        ('Director', 'ver_dashboard'),
        ('Director', 'gestionar_estructura'),
        ('Director', 'gestionar_cursos'),
        ('Director', 'gestionar_materias'),
        ('Director', 'asignar_materias'),
        ('Director', 'gestionar_horarios'),
        ('Director', 'gestionar_estudiantes'),
        ('Director', 'ver_estudiantes'),
        ('Director', 'gestionar_tutores'),
        ('Director', 'gestionar_inscripciones'),
        ('Director', 'consultar_expedientes'),
        ('Director', 'registrar_asistencia'),
        ('Director', 'ver_asistencias'),
        ('Director', 'gestionar_evaluaciones'),
        ('Director', 'ver_evaluaciones'),
        ('Director', 'gestionar_pagos'),
        ('Director', 'ver_pagos'),
        ('Director', 'gestionar_inventario'),
        ('Director', 'ver_inventario'),
        ('Director', 'registrar_entregas'),
        ('Director', 'ver_entregas'),
        ('Director', 'publicar_avisos'),
        ('Director', 'ver_reportes'),
        ('Profesor', 'ver_dashboard'),
        ('Profesor', 'ver_estudiantes'),
        ('Profesor', 'consultar_expedientes'),
        ('Profesor', 'registrar_asistencia'),
        ('Profesor', 'ver_asistencias'),
        ('Profesor', 'gestionar_evaluaciones'),
        ('Profesor', 'ver_evaluaciones'),
        ('Profesor', 'publicar_avisos'),
        ('Administrativo', 'ver_dashboard'),
        ('Administrativo', 'gestionar_estructura'),
        ('Administrativo', 'gestionar_estudiantes'),
        ('Administrativo', 'ver_estudiantes'),
        ('Administrativo', 'gestionar_tutores'),
        ('Administrativo', 'gestionar_inscripciones'),
        ('Administrativo', 'consultar_expedientes'),
        ('Administrativo', 'gestionar_pagos'),
        ('Administrativo', 'ver_pagos'),
        ('Administrativo', 'gestionar_inventario'),
        ('Administrativo', 'ver_inventario'),
        ('Administrativo', 'registrar_entregas'),
        ('Administrativo', 'ver_entregas'),
        ('Administrativo', 'publicar_avisos'),
        ('Administrativo', 'ver_reportes')
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

INSERT INTO usuario (username, password_hash, id_rol, estado, email, intentos_fallidos)
VALUES (
    'superuser',
    '$2b$10$ozbyUS7L4A36HcnvDxzexuKX2YM1YDyQJt3xNraTyWW07Hkvz/VAy',
    1,
    TRUE,
    'superuser@local.test',
    0
)
ON CONFLICT (username) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    id_rol = EXCLUDED.id_rol,
    estado = TRUE,
    email = EXCLUDED.email,
    intentos_fallidos = 0,
    bloqueado_hasta = NULL;

COMMIT;
