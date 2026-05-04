-- Alinea la base existente con los controladores y pantallas agregados en ciclo 2.
-- Se puede ejecutar varias veces sin duplicar columnas ni datos base.

BEGIN;

ALTER TABLE IF EXISTS horario
    ADD COLUMN IF NOT EXISTS publicado BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE IF EXISTS estudiante
    ADD COLUMN IF NOT EXISTS observaciones TEXT;

CREATE TABLE IF NOT EXISTS modulo (
    id_modulo SERIAL PRIMARY KEY,
    nombre_modulo VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS funcionalidad (
    id_funcionalidad SERIAL PRIMARY KEY,
    metodo VARCHAR(120) NOT NULL,
    descripcion TEXT,
    id_permiso INTEGER NOT NULL REFERENCES permiso(id_permiso) ON DELETE CASCADE,
    id_modulo INTEGER NOT NULL REFERENCES modulo(id_modulo) ON DELETE CASCADE,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT funcionalidad_metodo_permiso_modulo_key UNIQUE (metodo, id_permiso, id_modulo)
);

CREATE TABLE IF NOT EXISTS rol_funcionalidad (
    id_rol INTEGER NOT NULL REFERENCES rol(id_rol) ON DELETE CASCADE,
    id_funcionalidad INTEGER NOT NULL REFERENCES funcionalidad(id_funcionalidad) ON DELETE CASCADE,
    fecha_asignacion TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_rol, id_funcionalidad)
);

INSERT INTO modulo (nombre_modulo, descripcion)
VALUES
    ('usuarios', 'Gestion de usuarios, roles y permisos'),
    ('seguridad', 'Auditoria, permisos y bitacora del sistema'),
    ('estructura', 'Gestion de aulas, niveles y grados'),
    ('academico', 'Gestion academica: cursos, materias y horarios'),
    ('estudiantes', 'Gestion de estudiantes, tutores e inscripciones'),
    ('expedientes', 'Consulta de expedientes digitales')
ON CONFLICT (nombre_modulo) DO UPDATE
SET descripcion = EXCLUDED.descripcion;

INSERT INTO permiso (nombre_permiso, descripcion)
VALUES
    ('gestionar_cursos', 'Crear, consultar y actualizar cursos'),
    ('gestionar_materias', 'Crear, consultar y actualizar materias'),
    ('asignar_materias', 'Asignar materias y profesores a cursos'),
    ('gestionar_horarios', 'Crear, editar y publicar horarios'),
    ('gestionar_tutores', 'Crear, consultar y actualizar tutores'),
    ('consultar_expedientes', 'Consultar expedientes digitales de estudiantes'),
    ('ver_bitacora', 'Consultar bitacora de auditoria del sistema')
ON CONFLICT (nombre_permiso) DO UPDATE
SET descripcion = EXCLUDED.descripcion;

INSERT INTO funcionalidad (metodo, descripcion, id_permiso, id_modulo)
SELECT datos.metodo, datos.descripcion, p.id_permiso, m.id_modulo
FROM (
    VALUES
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
        ('GET /api/materia-asig/*', 'Consultar asignaciones de materias', 'asignar_materias', 'academico'),
        ('POST /api/materia-asig/*', 'Asignar materias a cursos', 'asignar_materias', 'academico'),
        ('GET /api/horarios/*', 'Consultar horarios', 'gestionar_horarios', 'academico'),
        ('POST /api/horarios', 'Crear bloques de horario', 'gestionar_horarios', 'academico'),
        ('PUT /api/horarios/:id', 'Editar bloques de horario', 'gestionar_horarios', 'academico'),
        ('PUT /api/horarios/curso/:id_curso/publicar', 'Publicar horario', 'gestionar_horarios', 'academico'),
        ('GET /api/estudiantes/*', 'Consultar estudiantes', 'gestionar_estudiantes', 'estudiantes'),
        ('POST /api/estudiantes', 'Registrar estudiantes', 'gestionar_estudiantes', 'estudiantes'),
        ('PUT /api/estudiantes/:id', 'Actualizar estudiantes', 'gestionar_estudiantes', 'estudiantes'),
        ('GET /api/tutores/*', 'Consultar tutores', 'gestionar_tutores', 'estudiantes'),
        ('POST /api/tutores', 'Registrar tutores', 'gestionar_tutores', 'estudiantes'),
        ('POST /api/inscripciones', 'Inscribir estudiantes', 'gestionar_inscripciones', 'estudiantes'),
        ('PUT /api/inscripciones/*', 'Retirar o trasladar estudiantes', 'gestionar_inscripciones', 'estudiantes'),
        ('GET /api/expedientes/:id_estudiante', 'Consultar expediente digital', 'consultar_expedientes', 'expedientes')
) AS datos(metodo, descripcion, nombre_permiso, nombre_modulo)
JOIN permiso p ON p.nombre_permiso = datos.nombre_permiso
JOIN modulo m ON m.nombre_modulo = datos.nombre_modulo
ON CONFLICT (metodo, id_permiso, id_modulo) DO UPDATE
SET descripcion = EXCLUDED.descripcion,
    estado = TRUE;

INSERT INTO rol_permiso (id_rol, id_permiso)
SELECT r.id_rol, p.id_permiso
FROM rol r
CROSS JOIN permiso p
WHERE r.nombre_rol = 'SuperUsuario'
ON CONFLICT (id_rol, id_permiso) DO NOTHING;

INSERT INTO rol_funcionalidad (id_rol, id_funcionalidad)
SELECT DISTINCT rp.id_rol, f.id_funcionalidad
FROM rol_permiso rp
JOIN funcionalidad f ON f.id_permiso = rp.id_permiso
WHERE f.estado = TRUE
ON CONFLICT (id_rol, id_funcionalidad) DO NOTHING;

COMMIT;
