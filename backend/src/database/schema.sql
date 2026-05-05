--
-- PostgreSQL database dump
--

\restrict cg3pkGQlwyafpmA4D1v1EeWNEEXePoKcHcgTe9HmRtS6soRqypvHLHMnrHgPMFF

-- Dumped from database version 15.17
-- Dumped by pg_dump version 15.17

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

--
-- Name: fn_actualizar_deuda_al_pagar(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: fn_actualizar_stock(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: fn_bitacora_asistencia(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: fn_bitacora_entrega(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: fn_bitacora_pago(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: fn_calcular_edad(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: fn_marcar_deudas_en_mora(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: fn_validar_entrega_autorizada(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: fn_validar_inscripcion_unica(); Type: FUNCTION; Schema: public; Owner: -
--

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


--
-- Name: fn_validar_nota_maxima(); Type: FUNCTION; Schema: public; Owner: -
--

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

--
-- Name: actividad_evaluacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.actividad_evaluacion (
    id_actividad integer NOT NULL,
    id_curso_materia integer NOT NULL,
    id_dimension_eval integer NOT NULL,
    trimestre integer NOT NULL,
    nombre_actividad character varying(100) NOT NULL,
    fecha_actividad date,
    CONSTRAINT actividad_evaluacion_trimestre_check CHECK (((trimestre >= 1) AND (trimestre <= 3)))
);


--
-- Name: actividad_evaluacion_id_actividad_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.actividad_evaluacion_id_actividad_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: actividad_evaluacion_id_actividad_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.actividad_evaluacion_id_actividad_seq OWNED BY public.actividad_evaluacion.id_actividad;


--
-- Name: asistencia; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.asistencia (
    id_asistencia integer NOT NULL,
    id_estudiante integer NOT NULL,
    id_curso integer NOT NULL,
    fecha date NOT NULL,
    estado character varying(5) NOT NULL,
    observaciones text,
    id_usuario_registro integer NOT NULL,
    fecha_registro timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT asistencia_estado_check CHECK (((estado)::text = ANY ((ARRAY['P'::character varying, 'A'::character varying, 'T'::character varying, 'J'::character varying, 'L'::character varying])::text[])))
);


--
-- Name: asistencia_id_asistencia_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.asistencia_id_asistencia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: asistencia_id_asistencia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.asistencia_id_asistencia_seq OWNED BY public.asistencia.id_asistencia;


--
-- Name: aula; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.aula (
    id_aula integer NOT NULL,
    numero_aula character varying(20) NOT NULL,
    descripcion text,
    cantidad_mesas integer DEFAULT 0 NOT NULL,
    cantidad_sillas integer DEFAULT 0 NOT NULL,
    capacidad_estudiantes integer DEFAULT 0 NOT NULL
);


--
-- Name: aula_id_aula_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.aula_id_aula_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: aula_id_aula_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.aula_id_aula_seq OWNED BY public.aula.id_aula;


--
-- Name: aviso; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.aviso (
    id_aviso integer NOT NULL,
    titulo character varying(200) NOT NULL,
    contenido text NOT NULL,
    id_usuario integer NOT NULL,
    destinatario_tipo character varying(20) NOT NULL,
    id_curso_destino integer,
    fecha_envio timestamp without time zone DEFAULT now() NOT NULL,
    estado character varying(20) DEFAULT 'borrador'::character varying NOT NULL,
    CONSTRAINT aviso_destinatario_tipo_check CHECK (((destinatario_tipo)::text = ANY ((ARRAY['todos'::character varying, 'por_curso'::character varying, 'individual'::character varying])::text[]))),
    CONSTRAINT aviso_estado_check CHECK (((estado)::text = ANY ((ARRAY['borrador'::character varying, 'enviado'::character varying, 'cancelado'::character varying])::text[])))
);


--
-- Name: aviso_id_aviso_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.aviso_id_aviso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: aviso_id_aviso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.aviso_id_aviso_seq OWNED BY public.aviso.id_aviso;


--
-- Name: bitacora; Type: TABLE; Schema: public; Owner: -
--

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
    CONSTRAINT bitacora_accion_check CHECK (((accion)::text = ANY ((ARRAY['LOGIN'::character varying, 'LOGOUT'::character varying, 'INSERT'::character varying, 'UPDATE'::character varying, 'DELETE'::character varying, 'APROBACION'::character varying, 'VALIDACION'::character varying, 'EXPORTACION'::character varying, 'CONSULTA'::character varying, 'SISTEMA'::character varying])::text[])))
);


--
-- Name: bitacora_id_bitacora_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bitacora_id_bitacora_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bitacora_id_bitacora_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bitacora_id_bitacora_seq OWNED BY public.bitacora.id_bitacora;


--
-- Name: calificacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.calificacion (
    id_calificacion integer NOT NULL,
    id_actividad integer NOT NULL,
    id_estudiante integer NOT NULL,
    nota numeric(5,2) NOT NULL,
    fecha_evaluacion date DEFAULT CURRENT_DATE NOT NULL,
    observaciones text,
    CONSTRAINT calificacion_nota_check CHECK ((nota >= (0)::numeric))
);


--
-- Name: calificacion_id_calificacion_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.calificacion_id_calificacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: calificacion_id_calificacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.calificacion_id_calificacion_seq OWNED BY public.calificacion.id_calificacion;


--
-- Name: campo_saber; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campo_saber (
    id_campo integer NOT NULL,
    nombre_campo character varying(100) NOT NULL,
    orden_visualizacion integer NOT NULL,
    descripcion text
);


--
-- Name: campo_saber_id_campo_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.campo_saber_id_campo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: campo_saber_id_campo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.campo_saber_id_campo_seq OWNED BY public.campo_saber.id_campo;


--
-- Name: comprobante; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comprobante (
    id_comprobante integer NOT NULL,
    id_pago integer NOT NULL,
    numero_comprobante character varying(50) NOT NULL,
    archivo_pdf_url character varying(255),
    fecha_emision timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: comprobante_id_comprobante_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comprobante_id_comprobante_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comprobante_id_comprobante_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comprobante_id_comprobante_seq OWNED BY public.comprobante.id_comprobante;


--
-- Name: concepto_pago; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.concepto_pago (
    id_concepto integer NOT NULL,
    nombre_concepto character varying(100) NOT NULL,
    descripcion text
);


--
-- Name: concepto_pago_id_concepto_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.concepto_pago_id_concepto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: concepto_pago_id_concepto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.concepto_pago_id_concepto_seq OWNED BY public.concepto_pago.id_concepto;


--
-- Name: curso; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.curso (
    id_curso integer NOT NULL,
    id_grado integer NOT NULL,
    paralelo character varying(5) NOT NULL,
    id_aula integer NOT NULL,
    id_gestion integer NOT NULL,
    id_profesor integer NOT NULL,
    turno character varying(20) NOT NULL,
    estado boolean DEFAULT true NOT NULL,
    CONSTRAINT curso_turno_check CHECK (((turno)::text = ANY ((ARRAY['Mañana'::character varying, 'Tarde'::character varying])::text[])))
);


--
-- Name: curso_id_curso_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.curso_id_curso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: curso_id_curso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.curso_id_curso_seq OWNED BY public.curso.id_curso;


--
-- Name: curso_materia; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.curso_materia (
    id_curso_materia integer NOT NULL,
    id_curso integer NOT NULL,
    id_materia integer NOT NULL,
    id_profesor integer NOT NULL
);


--
-- Name: curso_materia_id_curso_materia_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.curso_materia_id_curso_materia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: curso_materia_id_curso_materia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.curso_materia_id_curso_materia_seq OWNED BY public.curso_materia.id_curso_materia;


--
-- Name: deuda; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deuda (
    id_deuda integer NOT NULL,
    id_estudiante integer NOT NULL,
    id_gestion integer NOT NULL,
    id_concepto integer NOT NULL,
    monto numeric(10,2) NOT NULL,
    mes character varying(20) NOT NULL,
    estado character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    fecha_generacion timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT deuda_estado_check CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'pagado'::character varying, 'mora'::character varying])::text[]))),
    CONSTRAINT deuda_monto_check CHECK ((monto >= (0)::numeric))
);


--
-- Name: deuda_id_deuda_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.deuda_id_deuda_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: deuda_id_deuda_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.deuda_id_deuda_seq OWNED BY public.deuda.id_deuda;


--
-- Name: dimension_evaluacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dimension_evaluacion (
    id_dimension_eval integer NOT NULL,
    nombre_dimension character varying(30) NOT NULL,
    puntaje_maximo numeric(5,2) NOT NULL,
    id_gestion integer NOT NULL,
    CONSTRAINT dimension_evaluacion_nombre_dimension_check CHECK (((nombre_dimension)::text = ANY ((ARRAY['Ser'::character varying, 'Saber'::character varying, 'Hacer'::character varying, 'Autoevaluacion'::character varying])::text[])))
);


--
-- Name: dimension_evaluacion_id_dimension_eval_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dimension_evaluacion_id_dimension_eval_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dimension_evaluacion_id_dimension_eval_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dimension_evaluacion_id_dimension_eval_seq OWNED BY public.dimension_evaluacion.id_dimension_eval;


--
-- Name: entrega_estudiante; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.entrega_estudiante (
    id_entrega integer NOT NULL,
    id_estudiante integer NOT NULL,
    id_tutor integer NOT NULL,
    id_usuario_supervisor integer NOT NULL,
    fecha_hora_entrega timestamp without time zone DEFAULT now() NOT NULL,
    observaciones text
);


--
-- Name: entrega_estudiante_id_entrega_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.entrega_estudiante_id_entrega_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: entrega_estudiante_id_entrega_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.entrega_estudiante_id_entrega_seq OWNED BY public.entrega_estudiante.id_entrega;


--
-- Name: estudiante; Type: TABLE; Schema: public; Owner: -
--

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
    CONSTRAINT estudiante_genero_check CHECK (((genero)::text = ANY ((ARRAY['Masculino'::character varying, 'Femenino'::character varying])::text[])))
);


--
-- Name: estudiante_id_estudiante_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.estudiante_id_estudiante_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: estudiante_id_estudiante_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.estudiante_id_estudiante_seq OWNED BY public.estudiante.id_estudiante;


--
-- Name: funcionalidad; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.funcionalidad (
    id_funcionalidad integer NOT NULL,
    metodo character varying(50) NOT NULL,
    descripcion text,
    id_permiso integer NOT NULL,
    id_modulo integer NOT NULL,
    estado boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: funcionalidad_id_funcionalidad_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.funcionalidad_id_funcionalidad_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: funcionalidad_id_funcionalidad_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.funcionalidad_id_funcionalidad_seq OWNED BY public.funcionalidad.id_funcionalidad;


--
-- Name: gestion_academica; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gestion_academica (
    id_gestion integer NOT NULL,
    anio integer NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    estado character varying(20) DEFAULT 'planificada'::character varying NOT NULL,
    CONSTRAINT gestion_academica_estado_check CHECK (((estado)::text = ANY ((ARRAY['planificada'::character varying, 'activa'::character varying, 'cerrada'::character varying])::text[])))
);


--
-- Name: gestion_academica_id_gestion_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.gestion_academica_id_gestion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gestion_academica_id_gestion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.gestion_academica_id_gestion_seq OWNED BY public.gestion_academica.id_gestion;


--
-- Name: grado; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grado (
    id_grado integer NOT NULL,
    nombre_grado character varying(50) NOT NULL,
    id_nivel integer NOT NULL
);


--
-- Name: grado_id_grado_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.grado_id_grado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: grado_id_grado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.grado_id_grado_seq OWNED BY public.grado.id_grado;


--
-- Name: horario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.horario (
    id_horario integer NOT NULL,
    id_curso integer NOT NULL,
    id_materia integer,
    dia_semana character varying(10) NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL,
    actividad character varying(100),
    publicado boolean DEFAULT false NOT NULL,
    CONSTRAINT horario_dia_semana_check CHECK (((dia_semana)::text = ANY ((ARRAY['lunes'::character varying, 'martes'::character varying, 'miercoles'::character varying, 'jueves'::character varying, 'viernes'::character varying])::text[]))),
    CONSTRAINT horario_hora_fin_check CHECK ((hora_fin > hora_inicio))
);


--
-- Name: horario_id_horario_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.horario_id_horario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: horario_id_horario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.horario_id_horario_seq OWNED BY public.horario.id_horario;


--
-- Name: inscripcion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inscripcion (
    id_inscripcion integer NOT NULL,
    id_estudiante integer NOT NULL,
    id_curso integer NOT NULL,
    fecha_inscripcion date DEFAULT CURRENT_DATE NOT NULL,
    estado character varying(20) DEFAULT 'inscrito'::character varying NOT NULL,
    observaciones text,
    CONSTRAINT inscripcion_estado_check CHECK (((estado)::text = ANY ((ARRAY['inscrito'::character varying, 'retirado'::character varying, 'trasladado'::character varying])::text[])))
);


--
-- Name: inscripcion_id_inscripcion_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.inscripcion_id_inscripcion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: inscripcion_id_inscripcion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.inscripcion_id_inscripcion_seq OWNED BY public.inscripcion.id_inscripcion;


--
-- Name: libreta_emitida; Type: TABLE; Schema: public; Owner: -
--

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
    CONSTRAINT libreta_emitida_estado_check CHECK (((estado)::text = ANY ((ARRAY['borrador'::character varying, 'aprobada'::character varying, 'entregada'::character varying])::text[]))),
    CONSTRAINT libreta_emitida_trimestre_check CHECK (((trimestre >= 1) AND (trimestre <= 3)))
);


--
-- Name: libreta_emitida_id_libreta_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.libreta_emitida_id_libreta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: libreta_emitida_id_libreta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.libreta_emitida_id_libreta_seq OWNED BY public.libreta_emitida.id_libreta;


--
-- Name: materia; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.materia (
    id_materia integer NOT NULL,
    nombre_materia character varying(100) NOT NULL,
    descripcion text,
    id_campo integer NOT NULL,
    aplica_primaria boolean DEFAULT true NOT NULL,
    estado boolean DEFAULT true NOT NULL
);


--
-- Name: materia_id_materia_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.materia_id_materia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: materia_id_materia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.materia_id_materia_seq OWNED BY public.materia.id_materia;


--
-- Name: material; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: material_id_material_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.material_id_material_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: material_id_material_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.material_id_material_seq OWNED BY public.material.id_material;


--
-- Name: modulo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.modulo (
    id_modulo integer NOT NULL,
    nombre_modulo character varying(80) NOT NULL,
    descripcion text,
    estado boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: modulo_id_modulo_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.modulo_id_modulo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: modulo_id_modulo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.modulo_id_modulo_seq OWNED BY public.modulo.id_modulo;


--
-- Name: movimiento_inventario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.movimiento_inventario (
    id_movimiento integer NOT NULL,
    id_material integer NOT NULL,
    tipo_movimiento character varying(20) NOT NULL,
    cantidad integer NOT NULL,
    fecha_movimiento timestamp without time zone DEFAULT now() NOT NULL,
    id_usuario integer NOT NULL,
    observaciones text,
    CONSTRAINT movimiento_inventario_cantidad_check CHECK ((cantidad > 0)),
    CONSTRAINT movimiento_inventario_tipo_movimiento_check CHECK (((tipo_movimiento)::text = ANY ((ARRAY['entrada'::character varying, 'salida'::character varying])::text[])))
);


--
-- Name: movimiento_inventario_id_movimiento_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.movimiento_inventario_id_movimiento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: movimiento_inventario_id_movimiento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.movimiento_inventario_id_movimiento_seq OWNED BY public.movimiento_inventario.id_movimiento;


--
-- Name: nivel; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nivel (
    id_nivel integer NOT NULL,
    nombre_nivel character varying(50) NOT NULL,
    monto_mensualidad numeric(10,2) DEFAULT 0 NOT NULL
);


--
-- Name: nivel_id_nivel_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nivel_id_nivel_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nivel_id_nivel_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nivel_id_nivel_seq OWNED BY public.nivel.id_nivel;


--
-- Name: notificacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notificacion (
    id_notificacion integer NOT NULL,
    id_aviso integer NOT NULL,
    id_tutor integer NOT NULL,
    canal character varying(20) NOT NULL,
    estado_envio character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    fecha_envio timestamp without time zone,
    CONSTRAINT notificacion_canal_check CHECK (((canal)::text = ANY ((ARRAY['whatsapp'::character varying, 'email'::character varying, 'sms'::character varying])::text[]))),
    CONSTRAINT notificacion_estado_envio_check CHECK (((estado_envio)::text = ANY ((ARRAY['pendiente'::character varying, 'enviado'::character varying, 'fallido'::character varying, 'leido'::character varying])::text[])))
);


--
-- Name: notificacion_id_notificacion_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notificacion_id_notificacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notificacion_id_notificacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notificacion_id_notificacion_seq OWNED BY public.notificacion.id_notificacion;


--
-- Name: pago; Type: TABLE; Schema: public; Owner: -
--

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
    CONSTRAINT pago_estado_check CHECK (((estado)::text = ANY ((ARRAY['pendiente_validacion'::character varying, 'validado'::character varying, 'rechazado'::character varying])::text[]))),
    CONSTRAINT pago_metodo_pago_check CHECK (((metodo_pago)::text = ANY ((ARRAY['efectivo'::character varying, 'QR'::character varying, 'transferencia'::character varying])::text[]))),
    CONSTRAINT pago_monto_pagado_check CHECK ((monto_pagado > (0)::numeric))
);


--
-- Name: pago_id_pago_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pago_id_pago_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pago_id_pago_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pago_id_pago_seq OWNED BY public.pago.id_pago;


--
-- Name: permiso; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permiso (
    id_permiso integer NOT NULL,
    nombre_permiso character varying(100) NOT NULL,
    descripcion text
);


--
-- Name: permiso_id_permiso_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.permiso_id_permiso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: permiso_id_permiso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.permiso_id_permiso_seq OWNED BY public.permiso.id_permiso;


--
-- Name: profesor; Type: TABLE; Schema: public; Owner: -
--

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
    CONSTRAINT profesor_genero_check CHECK (((genero)::text = ANY ((ARRAY['Masculino'::character varying, 'Femenino'::character varying])::text[])))
);


--
-- Name: profesor_id_profesor_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.profesor_id_profesor_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: profesor_id_profesor_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.profesor_id_profesor_seq OWNED BY public.profesor.id_profesor;


--
-- Name: rol; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rol (
    id_rol integer NOT NULL,
    nombre_rol character varying(50) NOT NULL,
    descripcion text,
    estado boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: rol_id_rol_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rol_id_rol_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rol_id_rol_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rol_id_rol_seq OWNED BY public.rol.id_rol;


--
-- Name: rol_permiso; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rol_permiso (
    id_rol integer NOT NULL,
    id_permiso integer NOT NULL
);


--
-- Name: tutor; Type: TABLE; Schema: public; Owner: -
--

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
    CONSTRAINT tutor_genero_check CHECK (((genero)::text = ANY ((ARRAY['Masculino'::character varying, 'Femenino'::character varying])::text[])))
);


--
-- Name: tutor_estudiante; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tutor_estudiante (
    id_tutor_estudiante integer NOT NULL,
    id_tutor integer NOT NULL,
    id_estudiante integer NOT NULL,
    parentesco character varying(30) NOT NULL,
    autorizado_recoger boolean DEFAULT true NOT NULL,
    contacto_emergencia boolean DEFAULT false NOT NULL
);


--
-- Name: tutor_estudiante_id_tutor_estudiante_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tutor_estudiante_id_tutor_estudiante_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tutor_estudiante_id_tutor_estudiante_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tutor_estudiante_id_tutor_estudiante_seq OWNED BY public.tutor_estudiante.id_tutor_estudiante;


--
-- Name: tutor_id_tutor_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tutor_id_tutor_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tutor_id_tutor_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tutor_id_tutor_seq OWNED BY public.tutor.id_tutor;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: -
--

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


--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuario_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;


--
-- Name: actividad_evaluacion id_actividad; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.actividad_evaluacion ALTER COLUMN id_actividad SET DEFAULT nextval('public.actividad_evaluacion_id_actividad_seq'::regclass);


--
-- Name: asistencia id_asistencia; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asistencia ALTER COLUMN id_asistencia SET DEFAULT nextval('public.asistencia_id_asistencia_seq'::regclass);


--
-- Name: aula id_aula; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.aula ALTER COLUMN id_aula SET DEFAULT nextval('public.aula_id_aula_seq'::regclass);


--
-- Name: aviso id_aviso; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.aviso ALTER COLUMN id_aviso SET DEFAULT nextval('public.aviso_id_aviso_seq'::regclass);


--
-- Name: bitacora id_bitacora; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bitacora ALTER COLUMN id_bitacora SET DEFAULT nextval('public.bitacora_id_bitacora_seq'::regclass);


--
-- Name: calificacion id_calificacion; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calificacion ALTER COLUMN id_calificacion SET DEFAULT nextval('public.calificacion_id_calificacion_seq'::regclass);


--
-- Name: campo_saber id_campo; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campo_saber ALTER COLUMN id_campo SET DEFAULT nextval('public.campo_saber_id_campo_seq'::regclass);


--
-- Name: comprobante id_comprobante; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprobante ALTER COLUMN id_comprobante SET DEFAULT nextval('public.comprobante_id_comprobante_seq'::regclass);


--
-- Name: concepto_pago id_concepto; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.concepto_pago ALTER COLUMN id_concepto SET DEFAULT nextval('public.concepto_pago_id_concepto_seq'::regclass);


--
-- Name: curso id_curso; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curso ALTER COLUMN id_curso SET DEFAULT nextval('public.curso_id_curso_seq'::regclass);


--
-- Name: curso_materia id_curso_materia; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curso_materia ALTER COLUMN id_curso_materia SET DEFAULT nextval('public.curso_materia_id_curso_materia_seq'::regclass);


--
-- Name: deuda id_deuda; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deuda ALTER COLUMN id_deuda SET DEFAULT nextval('public.deuda_id_deuda_seq'::regclass);


--
-- Name: dimension_evaluacion id_dimension_eval; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dimension_evaluacion ALTER COLUMN id_dimension_eval SET DEFAULT nextval('public.dimension_evaluacion_id_dimension_eval_seq'::regclass);


--
-- Name: entrega_estudiante id_entrega; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrega_estudiante ALTER COLUMN id_entrega SET DEFAULT nextval('public.entrega_estudiante_id_entrega_seq'::regclass);


--
-- Name: estudiante id_estudiante; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estudiante ALTER COLUMN id_estudiante SET DEFAULT nextval('public.estudiante_id_estudiante_seq'::regclass);


--
-- Name: funcionalidad id_funcionalidad; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.funcionalidad ALTER COLUMN id_funcionalidad SET DEFAULT nextval('public.funcionalidad_id_funcionalidad_seq'::regclass);


--
-- Name: gestion_academica id_gestion; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gestion_academica ALTER COLUMN id_gestion SET DEFAULT nextval('public.gestion_academica_id_gestion_seq'::regclass);


--
-- Name: grado id_grado; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grado ALTER COLUMN id_grado SET DEFAULT nextval('public.grado_id_grado_seq'::regclass);


--
-- Name: horario id_horario; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.horario ALTER COLUMN id_horario SET DEFAULT nextval('public.horario_id_horario_seq'::regclass);


--
-- Name: inscripcion id_inscripcion; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inscripcion ALTER COLUMN id_inscripcion SET DEFAULT nextval('public.inscripcion_id_inscripcion_seq'::regclass);


--
-- Name: libreta_emitida id_libreta; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.libreta_emitida ALTER COLUMN id_libreta SET DEFAULT nextval('public.libreta_emitida_id_libreta_seq'::regclass);


--
-- Name: materia id_materia; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materia ALTER COLUMN id_materia SET DEFAULT nextval('public.materia_id_materia_seq'::regclass);


--
-- Name: material id_material; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.material ALTER COLUMN id_material SET DEFAULT nextval('public.material_id_material_seq'::regclass);


--
-- Name: modulo id_modulo; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modulo ALTER COLUMN id_modulo SET DEFAULT nextval('public.modulo_id_modulo_seq'::regclass);


--
-- Name: movimiento_inventario id_movimiento; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimiento_inventario ALTER COLUMN id_movimiento SET DEFAULT nextval('public.movimiento_inventario_id_movimiento_seq'::regclass);


--
-- Name: nivel id_nivel; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nivel ALTER COLUMN id_nivel SET DEFAULT nextval('public.nivel_id_nivel_seq'::regclass);


--
-- Name: notificacion id_notificacion; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificacion ALTER COLUMN id_notificacion SET DEFAULT nextval('public.notificacion_id_notificacion_seq'::regclass);


--
-- Name: pago id_pago; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pago ALTER COLUMN id_pago SET DEFAULT nextval('public.pago_id_pago_seq'::regclass);


--
-- Name: permiso id_permiso; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permiso ALTER COLUMN id_permiso SET DEFAULT nextval('public.permiso_id_permiso_seq'::regclass);


--
-- Name: profesor id_profesor; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profesor ALTER COLUMN id_profesor SET DEFAULT nextval('public.profesor_id_profesor_seq'::regclass);


--
-- Name: rol id_rol; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rol ALTER COLUMN id_rol SET DEFAULT nextval('public.rol_id_rol_seq'::regclass);


--
-- Name: tutor id_tutor; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tutor ALTER COLUMN id_tutor SET DEFAULT nextval('public.tutor_id_tutor_seq'::regclass);


--
-- Name: tutor_estudiante id_tutor_estudiante; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tutor_estudiante ALTER COLUMN id_tutor_estudiante SET DEFAULT nextval('public.tutor_estudiante_id_tutor_estudiante_seq'::regclass);


--
-- Name: usuario id_usuario; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);


--
-- Name: actividad_evaluacion actividad_evaluacion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.actividad_evaluacion
    ADD CONSTRAINT actividad_evaluacion_pkey PRIMARY KEY (id_actividad);


--
-- Name: asistencia asistencia_id_estudiante_id_curso_fecha_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asistencia
    ADD CONSTRAINT asistencia_id_estudiante_id_curso_fecha_key UNIQUE (id_estudiante, id_curso, fecha);


--
-- Name: asistencia asistencia_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asistencia
    ADD CONSTRAINT asistencia_pkey PRIMARY KEY (id_asistencia);


--
-- Name: aula aula_numero_aula_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.aula
    ADD CONSTRAINT aula_numero_aula_key UNIQUE (numero_aula);


--
-- Name: aula aula_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.aula
    ADD CONSTRAINT aula_pkey PRIMARY KEY (id_aula);


--
-- Name: aviso aviso_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.aviso
    ADD CONSTRAINT aviso_pkey PRIMARY KEY (id_aviso);


--
-- Name: bitacora bitacora_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bitacora
    ADD CONSTRAINT bitacora_pkey PRIMARY KEY (id_bitacora);


--
-- Name: calificacion calificacion_id_actividad_id_estudiante_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calificacion
    ADD CONSTRAINT calificacion_id_actividad_id_estudiante_key UNIQUE (id_actividad, id_estudiante);


--
-- Name: calificacion calificacion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calificacion
    ADD CONSTRAINT calificacion_pkey PRIMARY KEY (id_calificacion);


--
-- Name: campo_saber campo_saber_nombre_campo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campo_saber
    ADD CONSTRAINT campo_saber_nombre_campo_key UNIQUE (nombre_campo);


--
-- Name: campo_saber campo_saber_orden_visualizacion_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campo_saber
    ADD CONSTRAINT campo_saber_orden_visualizacion_key UNIQUE (orden_visualizacion);


--
-- Name: campo_saber campo_saber_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campo_saber
    ADD CONSTRAINT campo_saber_pkey PRIMARY KEY (id_campo);


--
-- Name: comprobante comprobante_id_pago_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprobante
    ADD CONSTRAINT comprobante_id_pago_key UNIQUE (id_pago);


--
-- Name: comprobante comprobante_numero_comprobante_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprobante
    ADD CONSTRAINT comprobante_numero_comprobante_key UNIQUE (numero_comprobante);


--
-- Name: comprobante comprobante_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprobante
    ADD CONSTRAINT comprobante_pkey PRIMARY KEY (id_comprobante);


--
-- Name: concepto_pago concepto_pago_nombre_concepto_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.concepto_pago
    ADD CONSTRAINT concepto_pago_nombre_concepto_key UNIQUE (nombre_concepto);


--
-- Name: concepto_pago concepto_pago_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.concepto_pago
    ADD CONSTRAINT concepto_pago_pkey PRIMARY KEY (id_concepto);


--
-- Name: curso curso_id_grado_paralelo_id_gestion_turno_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curso
    ADD CONSTRAINT curso_id_grado_paralelo_id_gestion_turno_key UNIQUE (id_grado, paralelo, id_gestion, turno);


--
-- Name: curso_materia curso_materia_id_curso_id_materia_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curso_materia
    ADD CONSTRAINT curso_materia_id_curso_id_materia_key UNIQUE (id_curso, id_materia);


--
-- Name: curso_materia curso_materia_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curso_materia
    ADD CONSTRAINT curso_materia_pkey PRIMARY KEY (id_curso_materia);


--
-- Name: curso curso_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curso
    ADD CONSTRAINT curso_pkey PRIMARY KEY (id_curso);


--
-- Name: deuda deuda_estudiante_gestion_concepto_mes_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deuda
    ADD CONSTRAINT deuda_estudiante_gestion_concepto_mes_key UNIQUE (id_estudiante, id_gestion, id_concepto, mes);


--
-- Name: deuda deuda_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deuda
    ADD CONSTRAINT deuda_pkey PRIMARY KEY (id_deuda);


--
-- Name: dimension_evaluacion dimension_evaluacion_nombre_dimension_id_gestion_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dimension_evaluacion
    ADD CONSTRAINT dimension_evaluacion_nombre_dimension_id_gestion_key UNIQUE (nombre_dimension, id_gestion);


--
-- Name: dimension_evaluacion dimension_evaluacion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dimension_evaluacion
    ADD CONSTRAINT dimension_evaluacion_pkey PRIMARY KEY (id_dimension_eval);


--
-- Name: entrega_estudiante entrega_estudiante_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrega_estudiante
    ADD CONSTRAINT entrega_estudiante_pkey PRIMARY KEY (id_entrega);


--
-- Name: estudiante estudiante_ci_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estudiante
    ADD CONSTRAINT estudiante_ci_key UNIQUE (ci);


--
-- Name: estudiante estudiante_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estudiante
    ADD CONSTRAINT estudiante_pkey PRIMARY KEY (id_estudiante);


--
-- Name: funcionalidad funcionalidad_metodo_id_permiso_id_modulo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.funcionalidad
    ADD CONSTRAINT funcionalidad_metodo_id_permiso_id_modulo_key UNIQUE (metodo, id_permiso, id_modulo);


--
-- Name: funcionalidad funcionalidad_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.funcionalidad
    ADD CONSTRAINT funcionalidad_pkey PRIMARY KEY (id_funcionalidad);


--
-- Name: gestion_academica gestion_academica_anio_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gestion_academica
    ADD CONSTRAINT gestion_academica_anio_key UNIQUE (anio);


--
-- Name: gestion_academica gestion_academica_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gestion_academica
    ADD CONSTRAINT gestion_academica_pkey PRIMARY KEY (id_gestion);


--
-- Name: grado grado_nombre_grado_id_nivel_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grado
    ADD CONSTRAINT grado_nombre_grado_id_nivel_key UNIQUE (nombre_grado, id_nivel);


--
-- Name: grado grado_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grado
    ADD CONSTRAINT grado_pkey PRIMARY KEY (id_grado);


--
-- Name: horario horario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.horario
    ADD CONSTRAINT horario_pkey PRIMARY KEY (id_horario);


--
-- Name: inscripcion inscripcion_id_estudiante_id_curso_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inscripcion
    ADD CONSTRAINT inscripcion_id_estudiante_id_curso_key UNIQUE (id_estudiante, id_curso);


--
-- Name: inscripcion inscripcion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inscripcion
    ADD CONSTRAINT inscripcion_pkey PRIMARY KEY (id_inscripcion);


--
-- Name: libreta_emitida libreta_emitida_estudiante_curso_gestion_trimestre_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.libreta_emitida
    ADD CONSTRAINT libreta_emitida_estudiante_curso_gestion_trimestre_key UNIQUE (id_estudiante, id_curso, id_gestion, trimestre);


--
-- Name: libreta_emitida libreta_emitida_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.libreta_emitida
    ADD CONSTRAINT libreta_emitida_pkey PRIMARY KEY (id_libreta);


--
-- Name: materia materia_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materia
    ADD CONSTRAINT materia_pkey PRIMARY KEY (id_materia);


--
-- Name: material material_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_pkey PRIMARY KEY (id_material);


--
-- Name: modulo modulo_nombre_modulo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modulo
    ADD CONSTRAINT modulo_nombre_modulo_key UNIQUE (nombre_modulo);


--
-- Name: modulo modulo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modulo
    ADD CONSTRAINT modulo_pkey PRIMARY KEY (id_modulo);


--
-- Name: movimiento_inventario movimiento_inventario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT movimiento_inventario_pkey PRIMARY KEY (id_movimiento);


--
-- Name: nivel nivel_nombre_nivel_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nivel
    ADD CONSTRAINT nivel_nombre_nivel_key UNIQUE (nombre_nivel);


--
-- Name: nivel nivel_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nivel
    ADD CONSTRAINT nivel_pkey PRIMARY KEY (id_nivel);


--
-- Name: notificacion notificacion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificacion
    ADD CONSTRAINT notificacion_pkey PRIMARY KEY (id_notificacion);


--
-- Name: pago pago_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_pkey PRIMARY KEY (id_pago);


--
-- Name: permiso permiso_nombre_permiso_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permiso
    ADD CONSTRAINT permiso_nombre_permiso_key UNIQUE (nombre_permiso);


--
-- Name: permiso permiso_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permiso
    ADD CONSTRAINT permiso_pkey PRIMARY KEY (id_permiso);


--
-- Name: profesor profesor_ci_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profesor
    ADD CONSTRAINT profesor_ci_key UNIQUE (ci);


--
-- Name: profesor profesor_id_usuario_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profesor
    ADD CONSTRAINT profesor_id_usuario_key UNIQUE (id_usuario);


--
-- Name: profesor profesor_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profesor
    ADD CONSTRAINT profesor_pkey PRIMARY KEY (id_profesor);


--
-- Name: rol rol_nombre_rol_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_nombre_rol_key UNIQUE (nombre_rol);


--
-- Name: rol_permiso rol_permiso_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rol_permiso
    ADD CONSTRAINT rol_permiso_pkey PRIMARY KEY (id_rol, id_permiso);


--
-- Name: rol rol_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (id_rol);


--
-- Name: tutor tutor_ci_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tutor
    ADD CONSTRAINT tutor_ci_key UNIQUE (ci);


--
-- Name: tutor_estudiante tutor_estudiante_id_tutor_id_estudiante_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tutor_estudiante
    ADD CONSTRAINT tutor_estudiante_id_tutor_id_estudiante_key UNIQUE (id_tutor, id_estudiante);


--
-- Name: tutor_estudiante tutor_estudiante_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tutor_estudiante
    ADD CONSTRAINT tutor_estudiante_pkey PRIMARY KEY (id_tutor_estudiante);


--
-- Name: tutor tutor_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tutor
    ADD CONSTRAINT tutor_pkey PRIMARY KEY (id_tutor);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- Name: usuario usuario_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_username_key UNIQUE (username);


--
-- Name: idx_asistencia_estudiante; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_asistencia_estudiante ON public.asistencia USING btree (id_estudiante);


--
-- Name: idx_asistencia_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_asistencia_fecha ON public.asistencia USING btree (fecha);


--
-- Name: idx_bitacora_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bitacora_fecha ON public.bitacora USING btree (fecha_hora);


--
-- Name: idx_bitacora_tabla; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bitacora_tabla ON public.bitacora USING btree (tabla_afectada);


--
-- Name: idx_bitacora_usuario; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bitacora_usuario ON public.bitacora USING btree (id_usuario);


--
-- Name: idx_calificacion_actividad; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_calificacion_actividad ON public.calificacion USING btree (id_actividad);


--
-- Name: idx_calificacion_estudiante; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_calificacion_estudiante ON public.calificacion USING btree (id_estudiante);


--
-- Name: idx_curso_gestion; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_curso_gestion ON public.curso USING btree (id_gestion);


--
-- Name: idx_curso_grado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_curso_grado ON public.curso USING btree (id_grado);


--
-- Name: idx_deuda_estado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_deuda_estado ON public.deuda USING btree (estado);


--
-- Name: idx_deuda_estudiante; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_deuda_estudiante ON public.deuda USING btree (id_estudiante);


--
-- Name: idx_funcionalidad_modulo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_funcionalidad_modulo ON public.funcionalidad USING btree (id_modulo);


--
-- Name: idx_funcionalidad_permiso; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_funcionalidad_permiso ON public.funcionalidad USING btree (id_permiso);


--
-- Name: idx_inscripcion_curso; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_inscripcion_curso ON public.inscripcion USING btree (id_curso);


--
-- Name: idx_inscripcion_estudiante; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_inscripcion_estudiante ON public.inscripcion USING btree (id_estudiante);


--
-- Name: idx_materia_campo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_materia_campo ON public.materia USING btree (id_campo);


--
-- Name: idx_pago_deuda; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pago_deuda ON public.pago USING btree (id_deuda);


--
-- Name: idx_pago_estudiante; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_pago_estudiante ON public.pago USING btree (id_estudiante);


--
-- Name: idx_usuario_email_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_usuario_email_unique ON public.usuario USING btree (email) WHERE (email IS NOT NULL);


--
-- Name: idx_usuario_rol; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usuario_rol ON public.usuario USING btree (id_rol);


--
-- Name: pago trg_actualizar_deuda_al_pagar; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_deuda_al_pagar AFTER INSERT OR UPDATE ON public.pago FOR EACH ROW EXECUTE FUNCTION public.fn_actualizar_deuda_al_pagar();


--
-- Name: movimiento_inventario trg_actualizar_stock; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_actualizar_stock AFTER INSERT ON public.movimiento_inventario FOR EACH ROW EXECUTE FUNCTION public.fn_actualizar_stock();


--
-- Name: asistencia trg_bitacora_asistencia; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_bitacora_asistencia AFTER INSERT OR UPDATE ON public.asistencia FOR EACH ROW EXECUTE FUNCTION public.fn_bitacora_asistencia();


--
-- Name: entrega_estudiante trg_bitacora_entrega; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_bitacora_entrega AFTER INSERT ON public.entrega_estudiante FOR EACH ROW EXECUTE FUNCTION public.fn_bitacora_entrega();


--
-- Name: pago trg_bitacora_pago; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_bitacora_pago AFTER INSERT OR UPDATE ON public.pago FOR EACH ROW EXECUTE FUNCTION public.fn_bitacora_pago();


--
-- Name: estudiante trg_calcular_edad; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_calcular_edad BEFORE INSERT OR UPDATE OF fecha_nacimiento ON public.estudiante FOR EACH ROW EXECUTE FUNCTION public.fn_calcular_edad();


--
-- Name: entrega_estudiante trg_validar_entrega_autorizada; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_validar_entrega_autorizada BEFORE INSERT ON public.entrega_estudiante FOR EACH ROW EXECUTE FUNCTION public.fn_validar_entrega_autorizada();


--
-- Name: inscripcion trg_validar_inscripcion_unica; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_validar_inscripcion_unica BEFORE INSERT OR UPDATE ON public.inscripcion FOR EACH ROW EXECUTE FUNCTION public.fn_validar_inscripcion_unica();


--
-- Name: calificacion trg_validar_nota_maxima; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_validar_nota_maxima BEFORE INSERT OR UPDATE ON public.calificacion FOR EACH ROW EXECUTE FUNCTION public.fn_validar_nota_maxima();


--
-- Name: deuda trg_verificar_mora_al_generar_deuda; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_verificar_mora_al_generar_deuda AFTER INSERT ON public.deuda FOR EACH ROW EXECUTE FUNCTION public.fn_marcar_deudas_en_mora();


--
-- Name: actividad_evaluacion actividad_evaluacion_id_curso_materia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.actividad_evaluacion
    ADD CONSTRAINT actividad_evaluacion_id_curso_materia_fkey FOREIGN KEY (id_curso_materia) REFERENCES public.curso_materia(id_curso_materia);


--
-- Name: actividad_evaluacion actividad_evaluacion_id_dimension_eval_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.actividad_evaluacion
    ADD CONSTRAINT actividad_evaluacion_id_dimension_eval_fkey FOREIGN KEY (id_dimension_eval) REFERENCES public.dimension_evaluacion(id_dimension_eval);


--
-- Name: asistencia asistencia_id_curso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asistencia
    ADD CONSTRAINT asistencia_id_curso_fkey FOREIGN KEY (id_curso) REFERENCES public.curso(id_curso);


--
-- Name: asistencia asistencia_id_estudiante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asistencia
    ADD CONSTRAINT asistencia_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES public.estudiante(id_estudiante);


--
-- Name: asistencia asistencia_id_usuario_registro_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asistencia
    ADD CONSTRAINT asistencia_id_usuario_registro_fkey FOREIGN KEY (id_usuario_registro) REFERENCES public.usuario(id_usuario);


--
-- Name: aviso aviso_id_curso_destino_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.aviso
    ADD CONSTRAINT aviso_id_curso_destino_fkey FOREIGN KEY (id_curso_destino) REFERENCES public.curso(id_curso);


--
-- Name: aviso aviso_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.aviso
    ADD CONSTRAINT aviso_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- Name: bitacora bitacora_id_funcionalidad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bitacora
    ADD CONSTRAINT bitacora_id_funcionalidad_fkey FOREIGN KEY (id_funcionalidad) REFERENCES public.funcionalidad(id_funcionalidad);


--
-- Name: bitacora bitacora_id_modulo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bitacora
    ADD CONSTRAINT bitacora_id_modulo_fkey FOREIGN KEY (id_modulo) REFERENCES public.modulo(id_modulo);


--
-- Name: bitacora bitacora_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bitacora
    ADD CONSTRAINT bitacora_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- Name: calificacion calificacion_id_actividad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calificacion
    ADD CONSTRAINT calificacion_id_actividad_fkey FOREIGN KEY (id_actividad) REFERENCES public.actividad_evaluacion(id_actividad);


--
-- Name: calificacion calificacion_id_estudiante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calificacion
    ADD CONSTRAINT calificacion_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES public.estudiante(id_estudiante);


--
-- Name: comprobante comprobante_id_pago_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comprobante
    ADD CONSTRAINT comprobante_id_pago_fkey FOREIGN KEY (id_pago) REFERENCES public.pago(id_pago);


--
-- Name: curso curso_id_aula_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curso
    ADD CONSTRAINT curso_id_aula_fkey FOREIGN KEY (id_aula) REFERENCES public.aula(id_aula);


--
-- Name: curso curso_id_gestion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curso
    ADD CONSTRAINT curso_id_gestion_fkey FOREIGN KEY (id_gestion) REFERENCES public.gestion_academica(id_gestion);


--
-- Name: curso curso_id_grado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curso
    ADD CONSTRAINT curso_id_grado_fkey FOREIGN KEY (id_grado) REFERENCES public.grado(id_grado);


--
-- Name: curso curso_id_profesor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curso
    ADD CONSTRAINT curso_id_profesor_fkey FOREIGN KEY (id_profesor) REFERENCES public.profesor(id_profesor);


--
-- Name: curso_materia curso_materia_id_curso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curso_materia
    ADD CONSTRAINT curso_materia_id_curso_fkey FOREIGN KEY (id_curso) REFERENCES public.curso(id_curso);


--
-- Name: curso_materia curso_materia_id_materia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curso_materia
    ADD CONSTRAINT curso_materia_id_materia_fkey FOREIGN KEY (id_materia) REFERENCES public.materia(id_materia);


--
-- Name: curso_materia curso_materia_id_profesor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curso_materia
    ADD CONSTRAINT curso_materia_id_profesor_fkey FOREIGN KEY (id_profesor) REFERENCES public.profesor(id_profesor);


--
-- Name: deuda deuda_id_concepto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deuda
    ADD CONSTRAINT deuda_id_concepto_fkey FOREIGN KEY (id_concepto) REFERENCES public.concepto_pago(id_concepto);


--
-- Name: deuda deuda_id_estudiante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deuda
    ADD CONSTRAINT deuda_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES public.estudiante(id_estudiante);


--
-- Name: deuda deuda_id_gestion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deuda
    ADD CONSTRAINT deuda_id_gestion_fkey FOREIGN KEY (id_gestion) REFERENCES public.gestion_academica(id_gestion);


--
-- Name: dimension_evaluacion dimension_evaluacion_id_gestion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dimension_evaluacion
    ADD CONSTRAINT dimension_evaluacion_id_gestion_fkey FOREIGN KEY (id_gestion) REFERENCES public.gestion_academica(id_gestion);


--
-- Name: entrega_estudiante entrega_estudiante_id_estudiante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrega_estudiante
    ADD CONSTRAINT entrega_estudiante_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES public.estudiante(id_estudiante);


--
-- Name: entrega_estudiante entrega_estudiante_id_tutor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrega_estudiante
    ADD CONSTRAINT entrega_estudiante_id_tutor_fkey FOREIGN KEY (id_tutor) REFERENCES public.tutor(id_tutor);


--
-- Name: entrega_estudiante entrega_estudiante_id_usuario_supervisor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrega_estudiante
    ADD CONSTRAINT entrega_estudiante_id_usuario_supervisor_fkey FOREIGN KEY (id_usuario_supervisor) REFERENCES public.usuario(id_usuario);


--
-- Name: funcionalidad funcionalidad_id_modulo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.funcionalidad
    ADD CONSTRAINT funcionalidad_id_modulo_fkey FOREIGN KEY (id_modulo) REFERENCES public.modulo(id_modulo) ON DELETE CASCADE;


--
-- Name: funcionalidad funcionalidad_id_permiso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.funcionalidad
    ADD CONSTRAINT funcionalidad_id_permiso_fkey FOREIGN KEY (id_permiso) REFERENCES public.permiso(id_permiso) ON DELETE CASCADE;


--
-- Name: grado grado_id_nivel_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grado
    ADD CONSTRAINT grado_id_nivel_fkey FOREIGN KEY (id_nivel) REFERENCES public.nivel(id_nivel);


--
-- Name: horario horario_id_curso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.horario
    ADD CONSTRAINT horario_id_curso_fkey FOREIGN KEY (id_curso) REFERENCES public.curso(id_curso);


--
-- Name: horario horario_id_materia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.horario
    ADD CONSTRAINT horario_id_materia_fkey FOREIGN KEY (id_materia) REFERENCES public.materia(id_materia);


--
-- Name: inscripcion inscripcion_id_curso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inscripcion
    ADD CONSTRAINT inscripcion_id_curso_fkey FOREIGN KEY (id_curso) REFERENCES public.curso(id_curso);


--
-- Name: inscripcion inscripcion_id_estudiante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inscripcion
    ADD CONSTRAINT inscripcion_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES public.estudiante(id_estudiante);


--
-- Name: libreta_emitida libreta_emitida_id_curso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.libreta_emitida
    ADD CONSTRAINT libreta_emitida_id_curso_fkey FOREIGN KEY (id_curso) REFERENCES public.curso(id_curso);


--
-- Name: libreta_emitida libreta_emitida_id_estudiante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.libreta_emitida
    ADD CONSTRAINT libreta_emitida_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES public.estudiante(id_estudiante);


--
-- Name: libreta_emitida libreta_emitida_id_gestion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.libreta_emitida
    ADD CONSTRAINT libreta_emitida_id_gestion_fkey FOREIGN KEY (id_gestion) REFERENCES public.gestion_academica(id_gestion);


--
-- Name: libreta_emitida libreta_emitida_id_usuario_aprobador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.libreta_emitida
    ADD CONSTRAINT libreta_emitida_id_usuario_aprobador_fkey FOREIGN KEY (id_usuario_aprobador) REFERENCES public.usuario(id_usuario);


--
-- Name: materia materia_id_campo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.materia
    ADD CONSTRAINT materia_id_campo_fkey FOREIGN KEY (id_campo) REFERENCES public.campo_saber(id_campo);


--
-- Name: movimiento_inventario movimiento_inventario_id_material_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT movimiento_inventario_id_material_fkey FOREIGN KEY (id_material) REFERENCES public.material(id_material);


--
-- Name: movimiento_inventario movimiento_inventario_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movimiento_inventario
    ADD CONSTRAINT movimiento_inventario_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- Name: notificacion notificacion_id_aviso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificacion
    ADD CONSTRAINT notificacion_id_aviso_fkey FOREIGN KEY (id_aviso) REFERENCES public.aviso(id_aviso);


--
-- Name: notificacion notificacion_id_tutor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificacion
    ADD CONSTRAINT notificacion_id_tutor_fkey FOREIGN KEY (id_tutor) REFERENCES public.tutor(id_tutor);


--
-- Name: pago pago_id_deuda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_id_deuda_fkey FOREIGN KEY (id_deuda) REFERENCES public.deuda(id_deuda);


--
-- Name: pago pago_id_estudiante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES public.estudiante(id_estudiante);


--
-- Name: pago pago_id_usuario_registro_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_id_usuario_registro_fkey FOREIGN KEY (id_usuario_registro) REFERENCES public.usuario(id_usuario);


--
-- Name: profesor profesor_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profesor
    ADD CONSTRAINT profesor_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


--
-- Name: rol_permiso rol_permiso_id_permiso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rol_permiso
    ADD CONSTRAINT rol_permiso_id_permiso_fkey FOREIGN KEY (id_permiso) REFERENCES public.permiso(id_permiso) ON DELETE CASCADE;


--
-- Name: rol_permiso rol_permiso_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rol_permiso
    ADD CONSTRAINT rol_permiso_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.rol(id_rol) ON DELETE CASCADE;


--
-- Name: tutor_estudiante tutor_estudiante_id_estudiante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tutor_estudiante
    ADD CONSTRAINT tutor_estudiante_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES public.estudiante(id_estudiante);


--
-- Name: tutor_estudiante tutor_estudiante_id_tutor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tutor_estudiante
    ADD CONSTRAINT tutor_estudiante_id_tutor_fkey FOREIGN KEY (id_tutor) REFERENCES public.tutor(id_tutor);


--
-- Name: usuario usuario_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.rol(id_rol);


--
-- Name: rol_funcionalidad; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE IF NOT EXISTS public.rol_funcionalidad (
    id_rol integer NOT NULL,
    id_funcionalidad integer NOT NULL,
    fecha_asignacion timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT rol_funcionalidad_pkey PRIMARY KEY (id_rol, id_funcionalidad),
    CONSTRAINT rol_funcionalidad_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.rol(id_rol) ON DELETE CASCADE,
    CONSTRAINT rol_funcionalidad_id_funcionalidad_fkey FOREIGN KEY (id_funcionalidad) REFERENCES public.funcionalidad(id_funcionalidad) ON DELETE CASCADE
);


--
-- PostgreSQL database dump complete
--

\unrestrict cg3pkGQlwyafpmA4D1v1EeWNEEXePoKcHcgTe9HmRtS6soRqypvHLHMnrHgPMFF
