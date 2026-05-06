\restrict 63ZV2LnOJqVlpUYQNdpctD2UGjxyRnzQADMm7Ww9bNaFIpiLebgYFCb4RyaqUTv
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
ALTER TABLE IF EXISTS ONLY public.usuario DROP CONSTRAINT IF EXISTS usuario_id_rol_fkey;
ALTER TABLE IF EXISTS ONLY public.tutor_estudiante DROP CONSTRAINT IF EXISTS tutor_estudiante_id_tutor_fkey;
ALTER TABLE IF EXISTS ONLY public.tutor_estudiante DROP CONSTRAINT IF EXISTS tutor_estudiante_id_estudiante_fkey;
ALTER TABLE IF EXISTS ONLY public.rol_permiso DROP CONSTRAINT IF EXISTS rol_permiso_id_rol_fkey;
ALTER TABLE IF EXISTS ONLY public.rol_permiso DROP CONSTRAINT IF EXISTS rol_permiso_id_permiso_fkey;
ALTER TABLE IF EXISTS ONLY public.rol_funcionalidad DROP CONSTRAINT IF EXISTS rol_funcionalidad_id_rol_fkey;
ALTER TABLE IF EXISTS ONLY public.rol_funcionalidad DROP CONSTRAINT IF EXISTS rol_funcionalidad_id_funcionalidad_fkey;
ALTER TABLE IF EXISTS ONLY public.profesor DROP CONSTRAINT IF EXISTS profesor_id_usuario_fkey;
ALTER TABLE IF EXISTS ONLY public.pago DROP CONSTRAINT IF EXISTS pago_id_usuario_registro_fkey;
ALTER TABLE IF EXISTS ONLY public.pago DROP CONSTRAINT IF EXISTS pago_id_estudiante_fkey;
ALTER TABLE IF EXISTS ONLY public.pago DROP CONSTRAINT IF EXISTS pago_id_deuda_fkey;
ALTER TABLE IF EXISTS ONLY public.notificacion DROP CONSTRAINT IF EXISTS notificacion_id_tutor_fkey;
ALTER TABLE IF EXISTS ONLY public.notificacion DROP CONSTRAINT IF EXISTS notificacion_id_aviso_fkey;
ALTER TABLE IF EXISTS ONLY public.movimiento_inventario DROP CONSTRAINT IF EXISTS movimiento_inventario_id_usuario_fkey;
ALTER TABLE IF EXISTS ONLY public.movimiento_inventario DROP CONSTRAINT IF EXISTS movimiento_inventario_id_material_fkey;
ALTER TABLE IF EXISTS ONLY public.materia DROP CONSTRAINT IF EXISTS materia_id_campo_fkey;
ALTER TABLE IF EXISTS ONLY public.libreta_emitida DROP CONSTRAINT IF EXISTS libreta_emitida_id_usuario_aprobador_fkey;
ALTER TABLE IF EXISTS ONLY public.libreta_emitida DROP CONSTRAINT IF EXISTS libreta_emitida_id_gestion_fkey;
ALTER TABLE IF EXISTS ONLY public.libreta_emitida DROP CONSTRAINT IF EXISTS libreta_emitida_id_estudiante_fkey;
ALTER TABLE IF EXISTS ONLY public.libreta_emitida DROP CONSTRAINT IF EXISTS libreta_emitida_id_curso_fkey;
ALTER TABLE IF EXISTS ONLY public.inscripcion DROP CONSTRAINT IF EXISTS inscripcion_id_estudiante_fkey;
ALTER TABLE IF EXISTS ONLY public.inscripcion DROP CONSTRAINT IF EXISTS inscripcion_id_curso_fkey;
ALTER TABLE IF EXISTS ONLY public.horario DROP CONSTRAINT IF EXISTS horario_id_materia_fkey;
ALTER TABLE IF EXISTS ONLY public.horario DROP CONSTRAINT IF EXISTS horario_id_curso_fkey;
ALTER TABLE IF EXISTS ONLY public.grado DROP CONSTRAINT IF EXISTS grado_id_nivel_fkey;
ALTER TABLE IF EXISTS ONLY public.funcionalidad DROP CONSTRAINT IF EXISTS funcionalidad_id_permiso_fkey;
ALTER TABLE IF EXISTS ONLY public.funcionalidad DROP CONSTRAINT IF EXISTS funcionalidad_id_modulo_fkey;
ALTER TABLE IF EXISTS ONLY public.entrega_estudiante DROP CONSTRAINT IF EXISTS entrega_estudiante_id_usuario_supervisor_fkey;
ALTER TABLE IF EXISTS ONLY public.entrega_estudiante DROP CONSTRAINT IF EXISTS entrega_estudiante_id_tutor_fkey;
ALTER TABLE IF EXISTS ONLY public.entrega_estudiante DROP CONSTRAINT IF EXISTS entrega_estudiante_id_estudiante_fkey;
ALTER TABLE IF EXISTS ONLY public.dimension_evaluacion DROP CONSTRAINT IF EXISTS dimension_evaluacion_id_gestion_fkey;
ALTER TABLE IF EXISTS ONLY public.deuda DROP CONSTRAINT IF EXISTS deuda_id_gestion_fkey;
ALTER TABLE IF EXISTS ONLY public.deuda DROP CONSTRAINT IF EXISTS deuda_id_estudiante_fkey;
ALTER TABLE IF EXISTS ONLY public.deuda DROP CONSTRAINT IF EXISTS deuda_id_concepto_fkey;
ALTER TABLE IF EXISTS ONLY public.curso_materia DROP CONSTRAINT IF EXISTS curso_materia_id_profesor_fkey;
ALTER TABLE IF EXISTS ONLY public.curso_materia DROP CONSTRAINT IF EXISTS curso_materia_id_materia_fkey;
ALTER TABLE IF EXISTS ONLY public.curso_materia DROP CONSTRAINT IF EXISTS curso_materia_id_curso_fkey;
ALTER TABLE IF EXISTS ONLY public.curso DROP CONSTRAINT IF EXISTS curso_id_profesor_fkey;
ALTER TABLE IF EXISTS ONLY public.curso DROP CONSTRAINT IF EXISTS curso_id_grado_fkey;
ALTER TABLE IF EXISTS ONLY public.curso DROP CONSTRAINT IF EXISTS curso_id_gestion_fkey;
ALTER TABLE IF EXISTS ONLY public.curso DROP CONSTRAINT IF EXISTS curso_id_aula_fkey;
ALTER TABLE IF EXISTS ONLY public.comprobante DROP CONSTRAINT IF EXISTS comprobante_id_pago_fkey;
ALTER TABLE IF EXISTS ONLY public.calificacion DROP CONSTRAINT IF EXISTS calificacion_id_estudiante_fkey;
ALTER TABLE IF EXISTS ONLY public.calificacion DROP CONSTRAINT IF EXISTS calificacion_id_actividad_fkey;
ALTER TABLE IF EXISTS ONLY public.bitacora DROP CONSTRAINT IF EXISTS bitacora_id_usuario_fkey;
ALTER TABLE IF EXISTS ONLY public.bitacora DROP CONSTRAINT IF EXISTS bitacora_id_modulo_fkey;
ALTER TABLE IF EXISTS ONLY public.bitacora DROP CONSTRAINT IF EXISTS bitacora_id_funcionalidad_fkey;
ALTER TABLE IF EXISTS ONLY public.aviso DROP CONSTRAINT IF EXISTS aviso_id_usuario_fkey;
ALTER TABLE IF EXISTS ONLY public.aviso DROP CONSTRAINT IF EXISTS aviso_id_curso_destino_fkey;
ALTER TABLE IF EXISTS ONLY public.asistencia DROP CONSTRAINT IF EXISTS asistencia_id_usuario_registro_fkey;
ALTER TABLE IF EXISTS ONLY public.asistencia DROP CONSTRAINT IF EXISTS asistencia_id_estudiante_fkey;
ALTER TABLE IF EXISTS ONLY public.asistencia DROP CONSTRAINT IF EXISTS asistencia_id_curso_fkey;
ALTER TABLE IF EXISTS ONLY public.actividad_evaluacion DROP CONSTRAINT IF EXISTS actividad_evaluacion_id_dimension_eval_fkey;
ALTER TABLE IF EXISTS ONLY public.actividad_evaluacion DROP CONSTRAINT IF EXISTS actividad_evaluacion_id_curso_materia_fkey;
DROP TRIGGER IF EXISTS trg_verificar_mora_al_generar_deuda ON public.deuda;
DROP TRIGGER IF EXISTS trg_validar_nota_maxima ON public.calificacion;
DROP TRIGGER IF EXISTS trg_validar_inscripcion_unica ON public.inscripcion;
DROP TRIGGER IF EXISTS trg_validar_entrega_autorizada ON public.entrega_estudiante;
DROP TRIGGER IF EXISTS trg_calcular_edad ON public.estudiante;
DROP TRIGGER IF EXISTS trg_bitacora_pago ON public.pago;
DROP TRIGGER IF EXISTS trg_bitacora_entrega ON public.entrega_estudiante;
DROP TRIGGER IF EXISTS trg_bitacora_asistencia ON public.asistencia;
DROP TRIGGER IF EXISTS trg_actualizar_stock ON public.movimiento_inventario;
DROP TRIGGER IF EXISTS trg_actualizar_deuda_al_pagar ON public.pago;
DROP INDEX IF EXISTS public.idx_usuario_rol;
DROP INDEX IF EXISTS public.idx_usuario_email_unique;
DROP INDEX IF EXISTS public.idx_pago_estudiante;
DROP INDEX IF EXISTS public.idx_pago_deuda;
DROP INDEX IF EXISTS public.idx_materia_campo;
DROP INDEX IF EXISTS public.idx_inscripcion_estudiante;
DROP INDEX IF EXISTS public.idx_inscripcion_curso;
DROP INDEX IF EXISTS public.idx_funcionalidad_permiso;
DROP INDEX IF EXISTS public.idx_funcionalidad_modulo;
DROP INDEX IF EXISTS public.idx_deuda_estudiante;
DROP INDEX IF EXISTS public.idx_deuda_estado;
DROP INDEX IF EXISTS public.idx_curso_grado;
DROP INDEX IF EXISTS public.idx_curso_gestion;
DROP INDEX IF EXISTS public.idx_calificacion_estudiante;
DROP INDEX IF EXISTS public.idx_calificacion_actividad;
DROP INDEX IF EXISTS public.idx_bitacora_usuario;
DROP INDEX IF EXISTS public.idx_bitacora_tabla;
DROP INDEX IF EXISTS public.idx_bitacora_fecha;
DROP INDEX IF EXISTS public.idx_asistencia_fecha;
DROP INDEX IF EXISTS public.idx_asistencia_estudiante;
ALTER TABLE IF EXISTS ONLY public.usuario DROP CONSTRAINT IF EXISTS usuario_username_key;
ALTER TABLE IF EXISTS ONLY public.usuario DROP CONSTRAINT IF EXISTS usuario_pkey;
ALTER TABLE IF EXISTS ONLY public.tutor DROP CONSTRAINT IF EXISTS tutor_pkey;
ALTER TABLE IF EXISTS ONLY public.tutor_estudiante DROP CONSTRAINT IF EXISTS tutor_estudiante_pkey;
ALTER TABLE IF EXISTS ONLY public.tutor_estudiante DROP CONSTRAINT IF EXISTS tutor_estudiante_id_tutor_id_estudiante_key;
ALTER TABLE IF EXISTS ONLY public.tutor DROP CONSTRAINT IF EXISTS tutor_ci_key;
ALTER TABLE IF EXISTS ONLY public.rol DROP CONSTRAINT IF EXISTS rol_pkey;
ALTER TABLE IF EXISTS ONLY public.rol_permiso DROP CONSTRAINT IF EXISTS rol_permiso_pkey;
ALTER TABLE IF EXISTS ONLY public.rol DROP CONSTRAINT IF EXISTS rol_nombre_rol_key;
ALTER TABLE IF EXISTS ONLY public.rol_funcionalidad DROP CONSTRAINT IF EXISTS rol_funcionalidad_pkey;
ALTER TABLE IF EXISTS ONLY public.profesor DROP CONSTRAINT IF EXISTS profesor_pkey;
ALTER TABLE IF EXISTS ONLY public.profesor DROP CONSTRAINT IF EXISTS profesor_id_usuario_key;
ALTER TABLE IF EXISTS ONLY public.profesor DROP CONSTRAINT IF EXISTS profesor_ci_key;
ALTER TABLE IF EXISTS ONLY public.permiso DROP CONSTRAINT IF EXISTS permiso_pkey;
ALTER TABLE IF EXISTS ONLY public.permiso DROP CONSTRAINT IF EXISTS permiso_nombre_permiso_key;
ALTER TABLE IF EXISTS ONLY public.pago DROP CONSTRAINT IF EXISTS pago_pkey;
ALTER TABLE IF EXISTS ONLY public.notificacion DROP CONSTRAINT IF EXISTS notificacion_pkey;
ALTER TABLE IF EXISTS ONLY public.nivel DROP CONSTRAINT IF EXISTS nivel_pkey;
ALTER TABLE IF EXISTS ONLY public.nivel DROP CONSTRAINT IF EXISTS nivel_nombre_nivel_key;
ALTER TABLE IF EXISTS ONLY public.movimiento_inventario DROP CONSTRAINT IF EXISTS movimiento_inventario_pkey;
ALTER TABLE IF EXISTS ONLY public.modulo DROP CONSTRAINT IF EXISTS modulo_pkey;
ALTER TABLE IF EXISTS ONLY public.modulo DROP CONSTRAINT IF EXISTS modulo_nombre_modulo_key;
ALTER TABLE IF EXISTS ONLY public.material DROP CONSTRAINT IF EXISTS material_pkey;
ALTER TABLE IF EXISTS ONLY public.materia DROP CONSTRAINT IF EXISTS materia_pkey;
ALTER TABLE IF EXISTS ONLY public.libreta_emitida DROP CONSTRAINT IF EXISTS libreta_emitida_pkey;
ALTER TABLE IF EXISTS ONLY public.libreta_emitida DROP CONSTRAINT IF EXISTS libreta_emitida_estudiante_curso_gestion_trimestre_key;
ALTER TABLE IF EXISTS ONLY public.inscripcion DROP CONSTRAINT IF EXISTS inscripcion_pkey;
ALTER TABLE IF EXISTS ONLY public.inscripcion DROP CONSTRAINT IF EXISTS inscripcion_id_estudiante_id_curso_key;
ALTER TABLE IF EXISTS ONLY public.horario DROP CONSTRAINT IF EXISTS horario_pkey;
ALTER TABLE IF EXISTS ONLY public.grado DROP CONSTRAINT IF EXISTS grado_pkey;
ALTER TABLE IF EXISTS ONLY public.grado DROP CONSTRAINT IF EXISTS grado_nombre_grado_id_nivel_key;
ALTER TABLE IF EXISTS ONLY public.gestion_academica DROP CONSTRAINT IF EXISTS gestion_academica_pkey;
ALTER TABLE IF EXISTS ONLY public.gestion_academica DROP CONSTRAINT IF EXISTS gestion_academica_anio_key;
ALTER TABLE IF EXISTS ONLY public.funcionalidad DROP CONSTRAINT IF EXISTS funcionalidad_pkey;
ALTER TABLE IF EXISTS ONLY public.funcionalidad DROP CONSTRAINT IF EXISTS funcionalidad_metodo_id_permiso_id_modulo_key;
ALTER TABLE IF EXISTS ONLY public.estudiante DROP CONSTRAINT IF EXISTS estudiante_pkey;
ALTER TABLE IF EXISTS ONLY public.estudiante DROP CONSTRAINT IF EXISTS estudiante_ci_key;
ALTER TABLE IF EXISTS ONLY public.entrega_estudiante DROP CONSTRAINT IF EXISTS entrega_estudiante_pkey;
ALTER TABLE IF EXISTS ONLY public.dimension_evaluacion DROP CONSTRAINT IF EXISTS dimension_evaluacion_pkey;
ALTER TABLE IF EXISTS ONLY public.dimension_evaluacion DROP CONSTRAINT IF EXISTS dimension_evaluacion_nombre_dimension_id_gestion_key;
ALTER TABLE IF EXISTS ONLY public.deuda DROP CONSTRAINT IF EXISTS deuda_pkey;
ALTER TABLE IF EXISTS ONLY public.deuda DROP CONSTRAINT IF EXISTS deuda_estudiante_gestion_concepto_mes_key;
ALTER TABLE IF EXISTS ONLY public.curso DROP CONSTRAINT IF EXISTS curso_pkey;
ALTER TABLE IF EXISTS ONLY public.curso_materia DROP CONSTRAINT IF EXISTS curso_materia_pkey;
ALTER TABLE IF EXISTS ONLY public.curso_materia DROP CONSTRAINT IF EXISTS curso_materia_id_curso_id_materia_key;
ALTER TABLE IF EXISTS ONLY public.curso DROP CONSTRAINT IF EXISTS curso_id_grado_paralelo_id_gestion_turno_key;
ALTER TABLE IF EXISTS ONLY public.concepto_pago DROP CONSTRAINT IF EXISTS concepto_pago_pkey;
ALTER TABLE IF EXISTS ONLY public.concepto_pago DROP CONSTRAINT IF EXISTS concepto_pago_nombre_concepto_key;
ALTER TABLE IF EXISTS ONLY public.comprobante DROP CONSTRAINT IF EXISTS comprobante_pkey;
ALTER TABLE IF EXISTS ONLY public.comprobante DROP CONSTRAINT IF EXISTS comprobante_numero_comprobante_key;
ALTER TABLE IF EXISTS ONLY public.comprobante DROP CONSTRAINT IF EXISTS comprobante_id_pago_key;
ALTER TABLE IF EXISTS ONLY public.campo_saber DROP CONSTRAINT IF EXISTS campo_saber_pkey;
ALTER TABLE IF EXISTS ONLY public.campo_saber DROP CONSTRAINT IF EXISTS campo_saber_orden_visualizacion_key;
ALTER TABLE IF EXISTS ONLY public.campo_saber DROP CONSTRAINT IF EXISTS campo_saber_nombre_campo_key;
ALTER TABLE IF EXISTS ONLY public.calificacion DROP CONSTRAINT IF EXISTS calificacion_pkey;
ALTER TABLE IF EXISTS ONLY public.calificacion DROP CONSTRAINT IF EXISTS calificacion_id_actividad_id_estudiante_key;
ALTER TABLE IF EXISTS ONLY public.bitacora DROP CONSTRAINT IF EXISTS bitacora_pkey;
ALTER TABLE IF EXISTS ONLY public.aviso DROP CONSTRAINT IF EXISTS aviso_pkey;
ALTER TABLE IF EXISTS ONLY public.aula DROP CONSTRAINT IF EXISTS aula_pkey;
ALTER TABLE IF EXISTS ONLY public.aula DROP CONSTRAINT IF EXISTS aula_numero_aula_key;
ALTER TABLE IF EXISTS ONLY public.asistencia DROP CONSTRAINT IF EXISTS asistencia_pkey;
ALTER TABLE IF EXISTS ONLY public.asistencia DROP CONSTRAINT IF EXISTS asistencia_id_estudiante_id_curso_fecha_key;
ALTER TABLE IF EXISTS ONLY public.actividad_evaluacion DROP CONSTRAINT IF EXISTS actividad_evaluacion_pkey;
ALTER TABLE IF EXISTS public.usuario ALTER COLUMN id_usuario DROP DEFAULT;
ALTER TABLE IF EXISTS public.tutor_estudiante ALTER COLUMN id_tutor_estudiante DROP DEFAULT;
ALTER TABLE IF EXISTS public.tutor ALTER COLUMN id_tutor DROP DEFAULT;
ALTER TABLE IF EXISTS public.rol ALTER COLUMN id_rol DROP DEFAULT;
ALTER TABLE IF EXISTS public.profesor ALTER COLUMN id_profesor DROP DEFAULT;
ALTER TABLE IF EXISTS public.permiso ALTER COLUMN id_permiso DROP DEFAULT;
ALTER TABLE IF EXISTS public.pago ALTER COLUMN id_pago DROP DEFAULT;
ALTER TABLE IF EXISTS public.notificacion ALTER COLUMN id_notificacion DROP DEFAULT;
ALTER TABLE IF EXISTS public.nivel ALTER COLUMN id_nivel DROP DEFAULT;
ALTER TABLE IF EXISTS public.movimiento_inventario ALTER COLUMN id_movimiento DROP DEFAULT;
ALTER TABLE IF EXISTS public.modulo ALTER COLUMN id_modulo DROP DEFAULT;
ALTER TABLE IF EXISTS public.material ALTER COLUMN id_material DROP DEFAULT;
ALTER TABLE IF EXISTS public.materia ALTER COLUMN id_materia DROP DEFAULT;
ALTER TABLE IF EXISTS public.libreta_emitida ALTER COLUMN id_libreta DROP DEFAULT;
ALTER TABLE IF EXISTS public.inscripcion ALTER COLUMN id_inscripcion DROP DEFAULT;
ALTER TABLE IF EXISTS public.horario ALTER COLUMN id_horario DROP DEFAULT;
ALTER TABLE IF EXISTS public.grado ALTER COLUMN id_grado DROP DEFAULT;
ALTER TABLE IF EXISTS public.gestion_academica ALTER COLUMN id_gestion DROP DEFAULT;
ALTER TABLE IF EXISTS public.funcionalidad ALTER COLUMN id_funcionalidad DROP DEFAULT;
ALTER TABLE IF EXISTS public.estudiante ALTER COLUMN id_estudiante DROP DEFAULT;
ALTER TABLE IF EXISTS public.entrega_estudiante ALTER COLUMN id_entrega DROP DEFAULT;
ALTER TABLE IF EXISTS public.dimension_evaluacion ALTER COLUMN id_dimension_eval DROP DEFAULT;
ALTER TABLE IF EXISTS public.deuda ALTER COLUMN id_deuda DROP DEFAULT;
ALTER TABLE IF EXISTS public.curso_materia ALTER COLUMN id_curso_materia DROP DEFAULT;
ALTER TABLE IF EXISTS public.curso ALTER COLUMN id_curso DROP DEFAULT;
ALTER TABLE IF EXISTS public.concepto_pago ALTER COLUMN id_concepto DROP DEFAULT;
ALTER TABLE IF EXISTS public.comprobante ALTER COLUMN id_comprobante DROP DEFAULT;
ALTER TABLE IF EXISTS public.campo_saber ALTER COLUMN id_campo DROP DEFAULT;
ALTER TABLE IF EXISTS public.calificacion ALTER COLUMN id_calificacion DROP DEFAULT;
ALTER TABLE IF EXISTS public.bitacora ALTER COLUMN id_bitacora DROP DEFAULT;
ALTER TABLE IF EXISTS public.aviso ALTER COLUMN id_aviso DROP DEFAULT;
ALTER TABLE IF EXISTS public.aula ALTER COLUMN id_aula DROP DEFAULT;
ALTER TABLE IF EXISTS public.asistencia ALTER COLUMN id_asistencia DROP DEFAULT;
ALTER TABLE IF EXISTS public.actividad_evaluacion ALTER COLUMN id_actividad DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.usuario_id_usuario_seq;
DROP TABLE IF EXISTS public.usuario;
DROP SEQUENCE IF EXISTS public.tutor_id_tutor_seq;
DROP SEQUENCE IF EXISTS public.tutor_estudiante_id_tutor_estudiante_seq;
DROP TABLE IF EXISTS public.tutor_estudiante;
DROP TABLE IF EXISTS public.tutor;
DROP TABLE IF EXISTS public.rol_permiso;
DROP SEQUENCE IF EXISTS public.rol_id_rol_seq;
DROP TABLE IF EXISTS public.rol_funcionalidad;
DROP TABLE IF EXISTS public.rol;
DROP SEQUENCE IF EXISTS public.profesor_id_profesor_seq;
DROP TABLE IF EXISTS public.profesor;
DROP SEQUENCE IF EXISTS public.permiso_id_permiso_seq;
DROP TABLE IF EXISTS public.permiso;
DROP SEQUENCE IF EXISTS public.pago_id_pago_seq;
DROP TABLE IF EXISTS public.pago;
DROP SEQUENCE IF EXISTS public.notificacion_id_notificacion_seq;
DROP TABLE IF EXISTS public.notificacion;
DROP SEQUENCE IF EXISTS public.nivel_id_nivel_seq;
DROP TABLE IF EXISTS public.nivel;
DROP SEQUENCE IF EXISTS public.movimiento_inventario_id_movimiento_seq;
DROP TABLE IF EXISTS public.movimiento_inventario;
DROP SEQUENCE IF EXISTS public.modulo_id_modulo_seq;
DROP TABLE IF EXISTS public.modulo;
DROP SEQUENCE IF EXISTS public.material_id_material_seq;
DROP TABLE IF EXISTS public.material;
DROP SEQUENCE IF EXISTS public.materia_id_materia_seq;
DROP TABLE IF EXISTS public.materia;
DROP SEQUENCE IF EXISTS public.libreta_emitida_id_libreta_seq;
DROP TABLE IF EXISTS public.libreta_emitida;
DROP SEQUENCE IF EXISTS public.inscripcion_id_inscripcion_seq;
DROP TABLE IF EXISTS public.inscripcion;
DROP SEQUENCE IF EXISTS public.horario_id_horario_seq;
DROP TABLE IF EXISTS public.horario;
DROP SEQUENCE IF EXISTS public.grado_id_grado_seq;
DROP TABLE IF EXISTS public.grado;
DROP SEQUENCE IF EXISTS public.gestion_academica_id_gestion_seq;
DROP TABLE IF EXISTS public.gestion_academica;
DROP SEQUENCE IF EXISTS public.funcionalidad_id_funcionalidad_seq;
DROP TABLE IF EXISTS public.funcionalidad;
DROP SEQUENCE IF EXISTS public.estudiante_id_estudiante_seq;
DROP TABLE IF EXISTS public.estudiante;
DROP SEQUENCE IF EXISTS public.entrega_estudiante_id_entrega_seq;
DROP TABLE IF EXISTS public.entrega_estudiante;
DROP SEQUENCE IF EXISTS public.dimension_evaluacion_id_dimension_eval_seq;
DROP TABLE IF EXISTS public.dimension_evaluacion;
DROP SEQUENCE IF EXISTS public.deuda_id_deuda_seq;
DROP TABLE IF EXISTS public.deuda;
DROP SEQUENCE IF EXISTS public.curso_materia_id_curso_materia_seq;
DROP TABLE IF EXISTS public.curso_materia;
DROP SEQUENCE IF EXISTS public.curso_id_curso_seq;
DROP TABLE IF EXISTS public.curso;
DROP SEQUENCE IF EXISTS public.concepto_pago_id_concepto_seq;
DROP TABLE IF EXISTS public.concepto_pago;
DROP SEQUENCE IF EXISTS public.comprobante_id_comprobante_seq;
DROP TABLE IF EXISTS public.comprobante;
DROP SEQUENCE IF EXISTS public.campo_saber_id_campo_seq;
DROP TABLE IF EXISTS public.campo_saber;
DROP SEQUENCE IF EXISTS public.calificacion_id_calificacion_seq;
DROP TABLE IF EXISTS public.calificacion;
DROP SEQUENCE IF EXISTS public.bitacora_id_bitacora_seq;
DROP TABLE IF EXISTS public.bitacora;
DROP SEQUENCE IF EXISTS public.aviso_id_aviso_seq;
DROP TABLE IF EXISTS public.aviso;
DROP SEQUENCE IF EXISTS public.aula_id_aula_seq;
DROP TABLE IF EXISTS public.aula;
DROP SEQUENCE IF EXISTS public.asistencia_id_asistencia_seq;
DROP TABLE IF EXISTS public.asistencia;
DROP SEQUENCE IF EXISTS public.actividad_evaluacion_id_actividad_seq;
DROP TABLE IF EXISTS public.actividad_evaluacion;
DROP FUNCTION IF EXISTS public.fn_validar_nota_maxima();
DROP FUNCTION IF EXISTS public.fn_validar_inscripcion_unica();
DROP FUNCTION IF EXISTS public.fn_validar_entrega_autorizada();
DROP FUNCTION IF EXISTS public.fn_marcar_deudas_en_mora();
DROP FUNCTION IF EXISTS public.fn_calcular_edad();
DROP FUNCTION IF EXISTS public.fn_bitacora_pago();
DROP FUNCTION IF EXISTS public.fn_bitacora_entrega();
DROP FUNCTION IF EXISTS public.fn_bitacora_asistencia();
DROP FUNCTION IF EXISTS public.fn_actualizar_stock();
DROP FUNCTION IF EXISTS public.fn_actualizar_deuda_al_pagar();
CREATE FUNCTION public.fn_actualizar_deuda_al_pagar() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.estado = 'validado' THEN
        UPDATE deuda
        SET estado = 'pagado'
        WHERE id_deuda = NEW.id_deuda;
    END IF;
    RETURN NEW;
END;
$$;
CREATE FUNCTION public.fn_actualizar_stock() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.tipo_movimiento = 'entrada' THEN
        UPDATE material
        SET stock_actual = stock_actual + NEW.cantidad
        WHERE id_material = NEW.id_material;
    ELSIF NEW.tipo_movimiento = 'salida' THEN
        IF (SELECT stock_actual FROM material WHERE id_material = NEW.id_material) < NEW.cantidad THEN
            RAISE EXCEPTION 'Stock insuficiente. Disponible: %, Solicitado: %',
                (SELECT stock_actual FROM material WHERE id_material = NEW.id_material),
                NEW.cantidad;
        END IF;
        UPDATE material
        SET stock_actual = stock_actual - NEW.cantidad
        WHERE id_material = NEW.id_material;
    END IF;
    RETURN NEW;
END;
$$;
CREATE FUNCTION public.fn_bitacora_asistencia() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO bitacora (
        id_usuario,
        id_modulo,
        id_funcionalidad,
        accion,
        tabla_afectada,
        id_registro_afectado,
        descripcion
    )
    SELECT
        NEW.id_usuario_registro,
        m.id_modulo,
        f.id_funcionalidad,
        CASE WHEN TG_OP = 'INSERT' THEN 'INSERT' ELSE 'UPDATE' END,
        'asistencia',
        NEW.id_asistencia,
        'Se registró o actualizó asistencia estudiantil.'
    FROM modulo m
    LEFT JOIN funcionalidad f ON f.id_modulo = m.id_modulo
    LEFT JOIN permiso p ON p.id_permiso = f.id_permiso
    WHERE m.nombre_modulo = 'asistencias'
      AND p.nombre_permiso = 'registrar_asistencia'
    LIMIT 1;
    RETURN NEW;
END;
$$;
CREATE FUNCTION public.fn_bitacora_entrega() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO bitacora (
        id_usuario,
        id_modulo,
        id_funcionalidad,
        accion,
        tabla_afectada,
        id_registro_afectado,
        descripcion
    )
    SELECT
        NEW.id_usuario_supervisor,
        m.id_modulo,
        f.id_funcionalidad,
        'INSERT',
        'entrega_estudiante',
        NEW.id_entrega,
        'Se registró la entrega de un estudiante.'
    FROM modulo m
    LEFT JOIN funcionalidad f ON f.id_modulo = m.id_modulo
    LEFT JOIN permiso p ON p.id_permiso = f.id_permiso
    WHERE m.nombre_modulo = 'entregas'
      AND p.nombre_permiso = 'registrar_entregas'
    LIMIT 1;
    RETURN NEW;
END;
$$;
CREATE FUNCTION public.fn_bitacora_pago() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO bitacora (
        id_usuario,
        id_modulo,
        id_funcionalidad,
        accion,
        tabla_afectada,
        id_registro_afectado,
        descripcion
    )
    SELECT
        NEW.id_usuario_registro,
        m.id_modulo,
        f.id_funcionalidad,
        CASE WHEN TG_OP = 'INSERT' THEN 'INSERT' ELSE 'UPDATE' END,
        'pago',
        NEW.id_pago,
        'Se registró o actualizó un pago en el sistema.'
    FROM modulo m
    LEFT JOIN funcionalidad f ON f.id_modulo = m.id_modulo
    LEFT JOIN permiso p ON p.id_permiso = f.id_permiso
    WHERE m.nombre_modulo = 'pagos'
      AND p.nombre_permiso = 'gestionar_pagos'
    LIMIT 1;
    RETURN NEW;
END;
$$;
CREATE FUNCTION public.fn_calcular_edad() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.fecha_nacimiento IS NOT NULL THEN
        NEW.edad := EXTRACT(YEAR FROM AGE(CURRENT_DATE, NEW.fecha_nacimiento));
    END IF;
    RETURN NEW;
END;
$$;
CREATE FUNCTION public.fn_marcar_deudas_en_mora() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE deuda
    SET estado = 'mora'
    WHERE estado = 'pendiente'
      AND fecha_generacion < (CURRENT_DATE - INTERVAL '30 days');
    RETURN NEW;
END;
$$;
CREATE FUNCTION public.fn_validar_entrega_autorizada() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_autorizado BOOLEAN;
BEGIN
    SELECT autorizado_recoger
    INTO v_autorizado
    FROM tutor_estudiante
    WHERE id_tutor = NEW.id_tutor
      AND id_estudiante = NEW.id_estudiante;
    IF v_autorizado IS NULL THEN
        NEW.observaciones := COALESCE(NEW.observaciones, '') ||
            ' [ALERTA: Tutor sin vínculo registrado]';
    ELSIF v_autorizado = FALSE THEN
        NEW.observaciones := COALESCE(NEW.observaciones, '') ||
            ' [ALERTA: Tutor no autorizado]';
    END IF;
    RETURN NEW;
END;
$$;
CREATE FUNCTION public.fn_validar_inscripcion_unica() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_gestion_nueva INT;
    v_existe BOOLEAN;
BEGIN
    SELECT id_gestion
    INTO v_gestion_nueva
    FROM curso
    WHERE id_curso = NEW.id_curso;
    SELECT EXISTS (
        SELECT 1
        FROM inscripcion i
        JOIN curso c ON i.id_curso = c.id_curso
        WHERE i.id_estudiante = NEW.id_estudiante
          AND c.id_gestion = v_gestion_nueva
          AND i.estado = 'inscrito'
          AND i.id_inscripcion IS DISTINCT FROM NEW.id_inscripcion
    )
    INTO v_existe;
    IF v_existe THEN
        RAISE EXCEPTION 'El estudiante ya tiene una inscripción activa en la gestión %',
            v_gestion_nueva;
    END IF;
    RETURN NEW;
END;
$$;
CREATE FUNCTION public.fn_validar_nota_maxima() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_max DECIMAL;
BEGIN
    SELECT de.puntaje_maximo
    INTO v_max
    FROM actividad_evaluacion ae
    JOIN dimension_evaluacion de ON ae.id_dimension_eval = de.id_dimension_eval
    WHERE ae.id_actividad = NEW.id_actividad;
    IF NEW.nota > v_max THEN
        RAISE EXCEPTION 'La nota (%) excede el puntaje máximo permitido (%)',
            NEW.nota, v_max;
    END IF;
    RETURN NEW;
END;
$$;
SET default_tablespace = '';
SET default_table_access_method = heap;
CREATE TABLE public.actividad_evaluacion (
    id_actividad integer NOT NULL,
    id_curso_materia integer NOT NULL,
    id_dimension_eval integer NOT NULL,
    trimestre integer NOT NULL,
    nombre_actividad character varying(100) NOT NULL,
    fecha_actividad date,
    CONSTRAINT actividad_evaluacion_trimestre_check CHECK (((trimestre >= 1) AND (trimestre <= 3)))
);
CREATE SEQUENCE public.actividad_evaluacion_id_actividad_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.actividad_evaluacion_id_actividad_seq OWNED BY public.actividad_evaluacion.id_actividad;
CREATE TABLE public.asistencia (
    id_asistencia integer NOT NULL,
    id_estudiante integer NOT NULL,
    id_curso integer NOT NULL,
    fecha date NOT NULL,
    estado character varying(5) NOT NULL,
    observaciones text,
    id_usuario_registro integer NOT NULL,
    fecha_registro timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT asistencia_estado_check CHECK (((estado)::text = ANY (ARRAY[('P'::character varying)::text, ('A'::character varying)::text, ('T'::character varying)::text, ('J'::character varying)::text, ('L'::character varying)::text])))
);
CREATE SEQUENCE public.asistencia_id_asistencia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.asistencia_id_asistencia_seq OWNED BY public.asistencia.id_asistencia;
CREATE TABLE public.aula (
    id_aula integer NOT NULL,
    numero_aula character varying(20) NOT NULL,
    descripcion text,
    cantidad_mesas integer DEFAULT 0 NOT NULL,
    cantidad_sillas integer DEFAULT 0 NOT NULL,
    capacidad_estudiantes integer DEFAULT 0 NOT NULL
);
CREATE SEQUENCE public.aula_id_aula_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.aula_id_aula_seq OWNED BY public.aula.id_aula;
CREATE TABLE public.aviso (
    id_aviso integer NOT NULL,
    titulo character varying(200) NOT NULL,
    contenido text NOT NULL,
    id_usuario integer NOT NULL,
    destinatario_tipo character varying(20) NOT NULL,
    id_curso_destino integer,
    fecha_envio timestamp without time zone DEFAULT now() NOT NULL,
    estado character varying(20) DEFAULT 'borrador'::character varying NOT NULL,
    CONSTRAINT aviso_destinatario_tipo_check CHECK (((destinatario_tipo)::text = ANY (ARRAY[('todos'::character varying)::text, ('por_curso'::character varying)::text, ('individual'::character varying)::text]))),
    CONSTRAINT aviso_estado_check CHECK (((estado)::text = ANY (ARRAY[('borrador'::character varying)::text, ('enviado'::character varying)::text, ('cancelado'::character varying)::text])))
);
CREATE SEQUENCE public.aviso_id_aviso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.aviso_id_aviso_seq OWNED BY public.aviso.id_aviso;
CREATE TABLE public.bitacora (
    id_bitacora integer NOT NULL,
    id_usuario integer,
    id_modulo integer,
    id_funcionalidad integer,
    accion character varying(50) NOT NULL,
    tabla_afectada character varying(100),
    id_registro_afectado integer,
    descripcion text,
    fecha_hora timestamp without time zone DEFAULT now() NOT NULL,
    ip_origen character varying(45),
    CONSTRAINT bitacora_accion_check CHECK (((accion)::text = ANY (ARRAY[('LOGIN'::character varying)::text, ('LOGOUT'::character varying)::text, ('INSERT'::character varying)::text, ('UPDATE'::character varying)::text, ('DELETE'::character varying)::text, ('APROBACION'::character varying)::text, ('VALIDACION'::character varying)::text, ('EXPORTACION'::character varying)::text, ('CONSULTA'::character varying)::text, ('SISTEMA'::character varying)::text])))
);
CREATE SEQUENCE public.bitacora_id_bitacora_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.bitacora_id_bitacora_seq OWNED BY public.bitacora.id_bitacora;
CREATE TABLE public.calificacion (
    id_calificacion integer NOT NULL,
    id_actividad integer NOT NULL,
    id_estudiante integer NOT NULL,
    nota numeric(5,2) NOT NULL,
    fecha_evaluacion date DEFAULT CURRENT_DATE NOT NULL,
    observaciones text,
    CONSTRAINT calificacion_nota_check CHECK ((nota >= (0)::numeric))
);
CREATE SEQUENCE public.calificacion_id_calificacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.calificacion_id_calificacion_seq OWNED BY public.calificacion.id_calificacion;
CREATE TABLE public.campo_saber (
    id_campo integer NOT NULL,
    nombre_campo character varying(100) NOT NULL,
    orden_visualizacion integer NOT NULL,
    descripcion text
);
CREATE SEQUENCE public.campo_saber_id_campo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.campo_saber_id_campo_seq OWNED BY public.campo_saber.id_campo;
CREATE TABLE public.comprobante (
    id_comprobante integer NOT NULL,
    id_pago integer NOT NULL,
    numero_comprobante character varying(50) NOT NULL,
    archivo_pdf_url character varying(255),
    fecha_emision timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.comprobante_id_comprobante_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.comprobante_id_comprobante_seq OWNED BY public.comprobante.id_comprobante;
CREATE TABLE public.concepto_pago (
    id_concepto integer NOT NULL,
    nombre_concepto character varying(100) NOT NULL,
    descripcion text
);
CREATE SEQUENCE public.concepto_pago_id_concepto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.concepto_pago_id_concepto_seq OWNED BY public.concepto_pago.id_concepto;
CREATE TABLE public.curso (
    id_curso integer NOT NULL,
    id_grado integer NOT NULL,
    paralelo character varying(5) NOT NULL,
    id_aula integer NOT NULL,
    id_gestion integer NOT NULL,
    id_profesor integer NOT NULL,
    turno character varying(20) NOT NULL,
    estado boolean DEFAULT true NOT NULL,
    CONSTRAINT curso_turno_check CHECK (((turno)::text = ANY (ARRAY[('Mañana'::character varying)::text, ('Tarde'::character varying)::text])))
);
CREATE SEQUENCE public.curso_id_curso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.curso_id_curso_seq OWNED BY public.curso.id_curso;
CREATE TABLE public.curso_materia (
    id_curso_materia integer NOT NULL,
    id_curso integer NOT NULL,
    id_materia integer NOT NULL,
    id_profesor integer NOT NULL
);
CREATE SEQUENCE public.curso_materia_id_curso_materia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.curso_materia_id_curso_materia_seq OWNED BY public.curso_materia.id_curso_materia;
CREATE TABLE public.deuda (
    id_deuda integer NOT NULL,
    id_estudiante integer NOT NULL,
    id_gestion integer NOT NULL,
    id_concepto integer NOT NULL,
    monto numeric(10,2) NOT NULL,
    mes character varying(20) NOT NULL,
    estado character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    fecha_generacion timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT deuda_estado_check CHECK (((estado)::text = ANY (ARRAY[('pendiente'::character varying)::text, ('pagado'::character varying)::text, ('mora'::character varying)::text]))),
    CONSTRAINT deuda_monto_check CHECK ((monto >= (0)::numeric))
);
CREATE SEQUENCE public.deuda_id_deuda_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.deuda_id_deuda_seq OWNED BY public.deuda.id_deuda;
CREATE TABLE public.dimension_evaluacion (
    id_dimension_eval integer NOT NULL,
    nombre_dimension character varying(30) NOT NULL,
    puntaje_maximo numeric(5,2) NOT NULL,
    id_gestion integer NOT NULL,
    CONSTRAINT dimension_evaluacion_nombre_dimension_check CHECK (((nombre_dimension)::text = ANY (ARRAY[('Ser'::character varying)::text, ('Saber'::character varying)::text, ('Hacer'::character varying)::text, ('Autoevaluacion'::character varying)::text])))
);
CREATE SEQUENCE public.dimension_evaluacion_id_dimension_eval_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.dimension_evaluacion_id_dimension_eval_seq OWNED BY public.dimension_evaluacion.id_dimension_eval;
CREATE TABLE public.entrega_estudiante (
    id_entrega integer NOT NULL,
    id_estudiante integer NOT NULL,
    id_tutor integer NOT NULL,
    id_usuario_supervisor integer NOT NULL,
    fecha_hora_entrega timestamp without time zone DEFAULT now() NOT NULL,
    observaciones text
);
CREATE SEQUENCE public.entrega_estudiante_id_entrega_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.entrega_estudiante_id_entrega_seq OWNED BY public.entrega_estudiante.id_entrega;
CREATE TABLE public.estudiante (
    id_estudiante integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    ci character varying(20),
    fecha_nacimiento date,
    edad integer,
    genero character varying(20) NOT NULL,
    estado character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    fecha_registro timestamp without time zone DEFAULT now() NOT NULL,
    observaciones text,
    CONSTRAINT estudiante_estado_check CHECK (((estado)::text = ANY ((ARRAY['activo'::character varying, 'inactivo'::character varying, 'retirado'::character varying, 'egresado'::character varying])::text[]))),
    CONSTRAINT estudiante_genero_check CHECK (((genero)::text = ANY (ARRAY[('Masculino'::character varying)::text, ('Femenino'::character varying)::text])))
);
CREATE SEQUENCE public.estudiante_id_estudiante_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.estudiante_id_estudiante_seq OWNED BY public.estudiante.id_estudiante;
CREATE TABLE public.funcionalidad (
    id_funcionalidad integer NOT NULL,
    metodo character varying(50) NOT NULL,
    descripcion text,
    id_permiso integer NOT NULL,
    id_modulo integer NOT NULL,
    estado boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.funcionalidad_id_funcionalidad_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.funcionalidad_id_funcionalidad_seq OWNED BY public.funcionalidad.id_funcionalidad;
CREATE TABLE public.gestion_academica (
    id_gestion integer NOT NULL,
    anio integer NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    estado character varying(20) DEFAULT 'planificada'::character varying NOT NULL,
    CONSTRAINT gestion_academica_estado_check CHECK (((estado)::text = ANY (ARRAY[('planificada'::character varying)::text, ('activa'::character varying)::text, ('cerrada'::character varying)::text])))
);
CREATE SEQUENCE public.gestion_academica_id_gestion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.gestion_academica_id_gestion_seq OWNED BY public.gestion_academica.id_gestion;
CREATE TABLE public.grado (
    id_grado integer NOT NULL,
    nombre_grado character varying(50) NOT NULL,
    id_nivel integer NOT NULL
);
CREATE SEQUENCE public.grado_id_grado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.grado_id_grado_seq OWNED BY public.grado.id_grado;
CREATE TABLE public.horario (
    id_horario integer NOT NULL,
    id_curso integer NOT NULL,
    id_materia integer,
    dia_semana character varying(10) NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL,
    actividad character varying(100),
    publicado boolean DEFAULT false NOT NULL,
    CONSTRAINT horario_dia_semana_check CHECK (((dia_semana)::text = ANY (ARRAY[('lunes'::character varying)::text, ('martes'::character varying)::text, ('miercoles'::character varying)::text, ('jueves'::character varying)::text, ('viernes'::character varying)::text]))),
    CONSTRAINT horario_hora_fin_check CHECK ((hora_fin > hora_inicio))
);
CREATE SEQUENCE public.horario_id_horario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.horario_id_horario_seq OWNED BY public.horario.id_horario;
CREATE TABLE public.inscripcion (
    id_inscripcion integer NOT NULL,
    id_estudiante integer NOT NULL,
    id_curso integer NOT NULL,
    fecha_inscripcion date DEFAULT CURRENT_DATE NOT NULL,
    estado character varying(20) DEFAULT 'inscrito'::character varying NOT NULL,
    observaciones text,
    CONSTRAINT inscripcion_estado_check CHECK (((estado)::text = ANY (ARRAY[('inscrito'::character varying)::text, ('retirado'::character varying)::text, ('trasladado'::character varying)::text])))
);
CREATE SEQUENCE public.inscripcion_id_inscripcion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.inscripcion_id_inscripcion_seq OWNED BY public.inscripcion.id_inscripcion;
CREATE TABLE public.libreta_emitida (
    id_libreta integer NOT NULL,
    id_estudiante integer NOT NULL,
    id_curso integer NOT NULL,
    id_gestion integer NOT NULL,
    trimestre integer,
    estado character varying(20) DEFAULT 'borrador'::character varying NOT NULL,
    id_usuario_aprobador integer,
    fecha_aprobacion timestamp without time zone,
    fecha_entrega timestamp without time zone,
    archivo_pdf_url character varying(255),
    CONSTRAINT libreta_emitida_estado_check CHECK (((estado)::text = ANY (ARRAY[('borrador'::character varying)::text, ('aprobada'::character varying)::text, ('entregada'::character varying)::text]))),
    CONSTRAINT libreta_emitida_trimestre_check CHECK (((trimestre >= 1) AND (trimestre <= 3)))
);
CREATE SEQUENCE public.libreta_emitida_id_libreta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.libreta_emitida_id_libreta_seq OWNED BY public.libreta_emitida.id_libreta;
CREATE TABLE public.materia (
    id_materia integer NOT NULL,
    nombre_materia character varying(100) NOT NULL,
    descripcion text,
    id_campo integer NOT NULL,
    aplica_primaria boolean DEFAULT true NOT NULL,
    estado boolean DEFAULT true NOT NULL
);
CREATE SEQUENCE public.materia_id_materia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.materia_id_materia_seq OWNED BY public.materia.id_materia;
CREATE TABLE public.material (
    id_material integer NOT NULL,
    nombre_item character varying(100) NOT NULL,
    descripcion text,
    categoria character varying(50) NOT NULL,
    stock_actual integer DEFAULT 0 NOT NULL,
    stock_minimo integer DEFAULT 0 NOT NULL,
    estado boolean DEFAULT true NOT NULL,
    fecha_registro timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT material_stock_actual_check CHECK ((stock_actual >= 0)),
    CONSTRAINT material_stock_minimo_check CHECK ((stock_minimo >= 0))
);
CREATE SEQUENCE public.material_id_material_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.material_id_material_seq OWNED BY public.material.id_material;
CREATE TABLE public.modulo (
    id_modulo integer NOT NULL,
    nombre_modulo character varying(80) NOT NULL,
    descripcion text,
    estado boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.modulo_id_modulo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.modulo_id_modulo_seq OWNED BY public.modulo.id_modulo;
CREATE TABLE public.movimiento_inventario (
    id_movimiento integer NOT NULL,
    id_material integer NOT NULL,
    tipo_movimiento character varying(20) NOT NULL,
    cantidad integer NOT NULL,
    fecha_movimiento timestamp without time zone DEFAULT now() NOT NULL,
    id_usuario integer NOT NULL,
    observaciones text,
    CONSTRAINT movimiento_inventario_cantidad_check CHECK ((cantidad > 0)),
    CONSTRAINT movimiento_inventario_tipo_movimiento_check CHECK (((tipo_movimiento)::text = ANY (ARRAY[('entrada'::character varying)::text, ('salida'::character varying)::text])))
);
CREATE SEQUENCE public.movimiento_inventario_id_movimiento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.movimiento_inventario_id_movimiento_seq OWNED BY public.movimiento_inventario.id_movimiento;
CREATE TABLE public.nivel (
    id_nivel integer NOT NULL,
    nombre_nivel character varying(50) NOT NULL,
    monto_mensualidad numeric(10,2) DEFAULT 0 NOT NULL
);
CREATE SEQUENCE public.nivel_id_nivel_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.nivel_id_nivel_seq OWNED BY public.nivel.id_nivel;
CREATE TABLE public.notificacion (
    id_notificacion integer NOT NULL,
    id_aviso integer NOT NULL,
    id_tutor integer NOT NULL,
    canal character varying(20) NOT NULL,
    estado_envio character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    fecha_envio timestamp without time zone,
    CONSTRAINT notificacion_canal_check CHECK (((canal)::text = ANY (ARRAY[('whatsapp'::character varying)::text, ('email'::character varying)::text, ('sms'::character varying)::text]))),
    CONSTRAINT notificacion_estado_envio_check CHECK (((estado_envio)::text = ANY (ARRAY[('pendiente'::character varying)::text, ('enviado'::character varying)::text, ('fallido'::character varying)::text, ('leido'::character varying)::text])))
);
CREATE SEQUENCE public.notificacion_id_notificacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.notificacion_id_notificacion_seq OWNED BY public.notificacion.id_notificacion;
CREATE TABLE public.pago (
    id_pago integer NOT NULL,
    id_deuda integer NOT NULL,
    id_estudiante integer NOT NULL,
    monto_pagado numeric(10,2) NOT NULL,
    metodo_pago character varying(30) NOT NULL,
    comprobante_url character varying(255),
    estado character varying(30) DEFAULT 'pendiente_validacion'::character varying NOT NULL,
    id_usuario_registro integer NOT NULL,
    fecha_pago timestamp without time zone DEFAULT now() NOT NULL,
    observaciones text,
    CONSTRAINT pago_estado_check CHECK (((estado)::text = ANY (ARRAY[('pendiente_validacion'::character varying)::text, ('validado'::character varying)::text, ('rechazado'::character varying)::text]))),
    CONSTRAINT pago_metodo_pago_check CHECK (((metodo_pago)::text = ANY (ARRAY[('efectivo'::character varying)::text, ('QR'::character varying)::text, ('transferencia'::character varying)::text]))),
    CONSTRAINT pago_monto_pagado_check CHECK ((monto_pagado > (0)::numeric))
);
CREATE SEQUENCE public.pago_id_pago_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.pago_id_pago_seq OWNED BY public.pago.id_pago;
CREATE TABLE public.permiso (
    id_permiso integer NOT NULL,
    nombre_permiso character varying(100) NOT NULL,
    descripcion text
);
CREATE SEQUENCE public.permiso_id_permiso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.permiso_id_permiso_seq OWNED BY public.permiso.id_permiso;
CREATE TABLE public.profesor (
    id_profesor integer NOT NULL,
    id_usuario integer,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    ci character varying(20) NOT NULL,
    profesion character varying(100),
    genero character varying(20) NOT NULL,
    estado boolean DEFAULT true NOT NULL,
    fecha_registro timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT profesor_genero_check CHECK (((genero)::text = ANY (ARRAY[('Masculino'::character varying)::text, ('Femenino'::character varying)::text])))
);
CREATE SEQUENCE public.profesor_id_profesor_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.profesor_id_profesor_seq OWNED BY public.profesor.id_profesor;
CREATE TABLE public.rol (
    id_rol integer NOT NULL,
    nombre_rol character varying(50) NOT NULL,
    descripcion text,
    estado boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.rol_funcionalidad (
    id_rol integer NOT NULL,
    id_funcionalidad integer NOT NULL,
    fecha_asignacion timestamp without time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.rol_id_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.rol_id_rol_seq OWNED BY public.rol.id_rol;
CREATE TABLE public.rol_permiso (
    id_rol integer NOT NULL,
    id_permiso integer NOT NULL
);
CREATE TABLE public.tutor (
    id_tutor integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    ci character varying(20) NOT NULL,
    genero character varying(20) NOT NULL,
    telefono character varying(20),
    correo_electronico character varying(100),
    direccion text,
    fecha_registro timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT tutor_genero_check CHECK (((genero)::text = ANY (ARRAY[('Masculino'::character varying)::text, ('Femenino'::character varying)::text])))
);
CREATE TABLE public.tutor_estudiante (
    id_tutor_estudiante integer NOT NULL,
    id_tutor integer NOT NULL,
    id_estudiante integer NOT NULL,
    parentesco character varying(30) NOT NULL,
    autorizado_recoger boolean DEFAULT true NOT NULL,
    contacto_emergencia boolean DEFAULT false NOT NULL
);
CREATE SEQUENCE public.tutor_estudiante_id_tutor_estudiante_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.tutor_estudiante_id_tutor_estudiante_seq OWNED BY public.tutor_estudiante.id_tutor_estudiante;
CREATE SEQUENCE public.tutor_id_tutor_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.tutor_id_tutor_seq OWNED BY public.tutor.id_tutor;
CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    id_rol integer NOT NULL,
    estado boolean DEFAULT true NOT NULL,
    ultimo_acceso timestamp without time zone,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    email character varying(100),
    intentos_fallidos integer DEFAULT 0 NOT NULL,
    bloqueado_hasta timestamp without time zone,
    reset_token character varying(255),
    reset_token_expira timestamp without time zone
);
CREATE SEQUENCE public.usuario_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;
ALTER TABLE ONLY public.actividad_evaluacion ALTER COLUMN id_actividad SET DEFAULT nextval('public.actividad_evaluacion_id_actividad_seq'::regclass);
ALTER TABLE ONLY public.asistencia ALTER COLUMN id_asistencia SET DEFAULT nextval('public.asistencia_id_asistencia_seq'::regclass);
ALTER TABLE ONLY public.aula ALTER COLUMN id_aula SET DEFAULT nextval('public.aula_id_aula_seq'::regclass);
ALTER TABLE ONLY public.aviso ALTER COLUMN id_aviso SET DEFAULT nextval('public.aviso_id_aviso_seq'::regclass);
ALTER TABLE ONLY public.bitacora ALTER COLUMN id_bitacora SET DEFAULT nextval('public.bitacora_id_bitacora_seq'::regclass);
ALTER TABLE ONLY public.calificacion ALTER COLUMN id_calificacion SET DEFAULT nextval('public.calificacion_id_calificacion_seq'::regclass);
ALTER TABLE ONLY public.campo_saber ALTER COLUMN id_campo SET DEFAULT nextval('public.campo_saber_id_campo_seq'::regclass);
ALTER TABLE ONLY public.comprobante ALTER COLUMN id_comprobante SET DEFAULT nextval('public.comprobante_id_comprobante_seq'::regclass);
ALTER TABLE ONLY public.concepto_pago ALTER COLUMN id_concepto SET DEFAULT nextval('public.concepto_pago_id_concepto_seq'::regclass);
ALTER TABLE ONLY public.curso ALTER COLUMN id_curso SET DEFAULT nextval('public.curso_id_curso_seq'::regclass);
ALTER TABLE ONLY public.curso_materia ALTER COLUMN id_curso_materia SET DEFAULT nextval('public.curso_materia_id_curso_materia_seq'::regclass);
ALTER TABLE ONLY public.deuda ALTER COLUMN id_deuda SET DEFAULT nextval('public.deuda_id_deuda_seq'::regclass);
ALTER TABLE ONLY public.dimension_evaluacion ALTER COLUMN id_dimension_eval SET DEFAULT nextval('public.dimension_evaluacion_id_dimension_eval_seq'::regclass);
ALTER TABLE ONLY public.entrega_estudiante ALTER COLUMN id_entrega SET DEFAULT nextval('public.entrega_estudiante_id_entrega_seq'::regclass);
ALTER TABLE ONLY public.estudiante ALTER COLUMN id_estudiante SET DEFAULT nextval('public.estudiante_id_estudiante_seq'::regclass);
ALTER TABLE ONLY public.funcionalidad ALTER COLUMN id_funcionalidad SET DEFAULT nextval('public.funcionalidad_id_funcionalidad_seq'::regclass);
ALTER TABLE ONLY public.gestion_academica ALTER COLUMN id_gestion SET DEFAULT nextval('public.gestion_academica_id_gestion_seq'::regclass);
ALTER TABLE ONLY public.grado ALTER COLUMN id_grado SET DEFAULT nextval('public.grado_id_grado_seq'::regclass);
ALTER TABLE ONLY public.horario ALTER COLUMN id_horario SET DEFAULT nextval('public.horario_id_horario_seq'::regclass);
ALTER TABLE ONLY public.inscripcion ALTER COLUMN id_inscripcion SET DEFAULT nextval('public.inscripcion_id_inscripcion_seq'::regclass);
ALTER TABLE ONLY public.libreta_emitida ALTER COLUMN id_libreta SET DEFAULT nextval('public.libreta_emitida_id_libreta_seq'::regclass);
ALTER TABLE ONLY public.materia ALTER COLUMN id_materia SET DEFAULT nextval('public.materia_id_materia_seq'::regclass);
ALTER TABLE ONLY public.material ALTER COLUMN id_material SET DEFAULT nextval('public.material_id_material_seq'::regclass);
ALTER TABLE ONLY public.modulo ALTER COLUMN id_modulo SET DEFAULT nextval('public.modulo_id_modulo_seq'::regclass);
ALTER TABLE ONLY public.movimiento_inventario ALTER COLUMN id_movimiento SET DEFAULT nextval('public.movimiento_inventario_id_movimiento_seq'::regclass);
ALTER TABLE ONLY public.nivel ALTER COLUMN id_nivel SET DEFAULT nextval('public.nivel_id_nivel_seq'::regclass);
ALTER TABLE ONLY public.notificacion ALTER COLUMN id_notificacion SET DEFAULT nextval('public.notificacion_id_notificacion_seq'::regclass);
ALTER TABLE ONLY public.pago ALTER COLUMN id_pago SET DEFAULT nextval('public.pago_id_pago_seq'::regclass);
ALTER TABLE ONLY public.permiso ALTER COLUMN id_permiso SET DEFAULT nextval('public.permiso_id_permiso_seq'::regclass);
ALTER TABLE ONLY public.profesor ALTER COLUMN id_profesor SET DEFAULT nextval('public.profesor_id_profesor_seq'::regclass);
ALTER TABLE ONLY public.rol ALTER COLUMN id_rol SET DEFAULT nextval('public.rol_id_rol_seq'::regclass);
ALTER TABLE ONLY public.tutor ALTER COLUMN id_tutor SET DEFAULT nextval('public.tutor_id_tutor_seq'::regclass);
ALTER TABLE ONLY public.tutor_estudiante ALTER COLUMN id_tutor_estudiante SET DEFAULT nextval('public.tutor_estudiante_id_tutor_estudiante_seq'::regclass);
ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);
COPY public.actividad_evaluacion (id_actividad, id_curso_materia, id_dimension_eval, trimestre, nombre_actividad, fecha_actividad) FROM stdin;
1	5	2	1	Practica demo de lectura	2026-04-15
\.
COPY public.asistencia (id_asistencia, id_estudiante, id_curso, fecha, estado, observaciones, id_usuario_registro, fecha_registro) FROM stdin;
1	5	1	2026-05-04	J	Cita medica	4	2026-05-06 13:36:59.335787
2	1	2	2026-05-04	P	\N	4	2026-05-06 13:36:59.335787
3	2	2	2026-05-04	T	Llego 10 minutos tarde	4	2026-05-06 13:36:59.335787
4	3	3	2026-05-04	P	\N	4	2026-05-06 13:36:59.335787
5	4	3	2026-05-04	A	Sin justificativo	4	2026-05-06 13:36:59.335787
\.
COPY public.aula (id_aula, numero_aula, descripcion, cantidad_mesas, cantidad_sillas, capacidad_estudiantes) FROM stdin;
1	A-101	Aula inicial con rincon de lectura	14	28	28
2	A-102	Aula primaria equipada	18	36	36
3	A-103	Aula primaria equipada	18	36	36
4	B-201	Aula secundaria	20	40	40
\.
COPY public.aviso (id_aviso, titulo, contenido, id_usuario, destinatario_tipo, id_curso_destino, fecha_envio, estado) FROM stdin;
1	Reunion de padres demo	Se convoca a reunion informativa para revisar avance academico.	4	por_curso	2	2026-05-06 08:00:00	enviado
\.
COPY public.bitacora (id_bitacora, id_usuario, id_modulo, id_funcionalidad, accion, tabla_afectada, id_registro_afectado, descripcion, fecha_hora, ip_origen) FROM stdin;
1	4	8	37	INSERT	asistencia	1	Se registró o actualizó asistencia estudiantil.	2026-05-06 13:36:59.335787	\N
2	4	8	37	INSERT	asistencia	2	Se registró o actualizó asistencia estudiantil.	2026-05-06 13:36:59.335787	\N
3	4	8	37	INSERT	asistencia	3	Se registró o actualizó asistencia estudiantil.	2026-05-06 13:36:59.335787	\N
4	4	8	37	INSERT	asistencia	4	Se registró o actualizó asistencia estudiantil.	2026-05-06 13:36:59.335787	\N
5	4	8	37	INSERT	asistencia	5	Se registró o actualizó asistencia estudiantil.	2026-05-06 13:36:59.335787	\N
6	4	10	40	INSERT	pago	1	Se registró o actualizó un pago en el sistema.	2026-05-06 13:36:59.335787	\N
7	4	10	40	INSERT	pago	2	Se registró o actualizó un pago en el sistema.	2026-05-06 13:36:59.335787	\N
\.
COPY public.calificacion (id_calificacion, id_actividad, id_estudiante, nota, fecha_evaluacion, observaciones) FROM stdin;
1	1	1	31.00	2026-04-16	Calificacion demo
2	1	2	28.00	2026-04-16	Calificacion demo
\.
COPY public.campo_saber (id_campo, nombre_campo, orden_visualizacion, descripcion) FROM stdin;
1	Comunidad y Sociedad	1	Lenguajes, ciencias sociales y expresiones culturales
2	Ciencia Tecnologia y Produccion	2	Matematicas, tecnica y tecnologia
3	Vida Tierra Territorio	3	Ciencias naturales y cuidado del entorno
4	Cosmos y Pensamiento	4	Valores, espiritualidad y convivencia
\.
COPY public.comprobante (id_comprobante, id_pago, numero_comprobante, archivo_pdf_url, fecha_emision) FROM stdin;
\.
COPY public.concepto_pago (id_concepto, nombre_concepto, descripcion) FROM stdin;
1	Inscripcion	Pago anual de inscripcion
2	Mensualidad	Pago mensual por nivel educativo
3	Material escolar	Pago por materiales escolares
4	Uniforme	Pago por uniforme institucional
\.
COPY public.curso (id_curso, id_grado, paralelo, id_aula, id_gestion, id_profesor, turno, estado) FROM stdin;
1	1	A	1	1	1	Tarde	t
2	3	A	2	1	1	Mañana	t
3	2	A	3	1	2	Mañana	t
\.
COPY public.curso_materia (id_curso_materia, id_curso, id_materia, id_profesor) FROM stdin;
1	1	1	1
2	1	2	2
3	1	3	1
4	1	4	1
5	2	1	1
6	2	2	2
7	2	3	1
8	2	4	1
9	3	1	1
10	3	2	2
11	3	3	1
12	3	4	1
\.
COPY public.deuda (id_deuda, id_estudiante, id_gestion, id_concepto, monto, mes, estado, fecha_generacion) FROM stdin;
1	4	1	1	150.00	Febrero	mora	2026-05-06 13:36:59.335787
2	5	1	2	180.00	Mayo	pendiente	2026-05-06 13:36:59.335787
4	2	1	2	220.00	Mayo	pendiente	2026-05-06 13:36:59.335787
5	1	1	2	220.00	Mayo	pendiente	2026-05-06 13:36:59.335787
3	3	1	2	220.00	Abril	pagado	2026-05-06 13:36:59.335787
\.
COPY public.dimension_evaluacion (id_dimension_eval, nombre_dimension, puntaje_maximo, id_gestion) FROM stdin;
1	Ser	10.00	1
2	Saber	35.00	1
3	Hacer	35.00	1
4	Autoevaluacion	10.00	1
\.
COPY public.entrega_estudiante (id_entrega, id_estudiante, id_tutor, id_usuario_supervisor, fecha_hora_entrega, observaciones) FROM stdin;
1	1	1	4	2026-05-04 12:20:00	Entrega demo autorizada
\.
COPY public.estudiante (id_estudiante, nombre, apellido, ci, fecha_nacimiento, edad, genero, estado, fecha_registro, observaciones) FROM stdin;
1	Sofia	Mamani	EST-2001	2018-04-12	8	Femenino	activo	2026-05-06 13:36:59.335787	Demo: estudiante de primero A
2	Lucas	Flores	EST-2002	2018-09-03	7	Masculino	activo	2026-05-06 13:36:59.335787	Demo: estudiante de primero A
3	Camila	Vargas	EST-2003	2017-02-22	9	Femenino	activo	2026-05-06 13:36:59.335787	Demo: estudiante de segundo A
4	Diego	Choque	EST-2004	2017-07-18	8	Masculino	activo	2026-05-06 13:36:59.335787	Demo: estudiante de segundo A
5	Valentina	Cruz	EST-2005	2020-01-15	6	Femenino	activo	2026-05-06 13:36:59.335787	Demo: estudiante de kinder A
\.
COPY public.funcionalidad (id_funcionalidad, metodo, descripcion, id_permiso, id_modulo, estado, fecha_creacion) FROM stdin;
1	GET /api/auth/me	Validar sesion	1	1	t	2026-05-06 13:36:59.1814
31	GET /api/estudiantes
