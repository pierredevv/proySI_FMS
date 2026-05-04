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
        ('GET /api/estudiantes/*', 'Consultar estudiantes', 'ver_estudiantes', 'estudiantes'),
        ('POST /api/estudiantes', 'Registrar estudiantes', 'gestionar_estudiantes', 'estudiantes'),
        ('PUT /api/estudiantes/:id', 'Actualizar estudiantes', 'gestionar_estudiantes', 'estudiantes'),
        ('GET /api/tutores/*', 'Consultar tutores', 'gestionar_tutores', 'estudiantes'),
        ('POST /api/tutores', 'Registrar tutores', 'gestionar_tutores', 'estudiantes'),
        ('POST /api/inscripciones', 'Inscribir estudiantes', 'gestionar_inscripciones', 'estudiantes'),
        ('PUT /api/inscripciones/*', 'Retirar o trasladar estudiantes', 'gestionar_inscripciones', 'estudiantes'),
        ('GET /api/expedientes/:id', 'Consultar expediente', 'consultar_expedientes', 'expedientes')
) AS datos(metodo, descripcion, nombre_permiso, nombre_modulo)
JOIN permiso p ON p.nombre_permiso = datos.nombre_permiso
JOIN modulo m ON m.nombre_modulo = datos.nombre_modulo
ON CONFLICT DO NOTHING;

INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT 1, id_permiso FROM permiso
ON CONFLICT (id_rol, id_permiso) DO NOTHING;

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
