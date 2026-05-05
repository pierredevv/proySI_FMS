BEGIN;

ALTER TABLE estudiante
DROP CONSTRAINT IF EXISTS estudiante_estado_check;

ALTER TABLE estudiante
ADD CONSTRAINT estudiante_estado_check
CHECK (estado IN ('activo', 'inactivo', 'retirado', 'egresado'));

COMMIT;
