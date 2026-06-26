-- ==============================================================
-- SISTEMA DE TRÁMITE DOCUMENTARIO - SCRIPT DDL
-- BASE DE DATOS: PostgreSQL
-- ==============================================================

-- 1. Eliminar tablas si existen (para facilitar recreación en pruebas)
DROP TABLE IF EXISTS documento_palabra_clave CASCADE;
DROP TABLE IF EXISTS palabra_clave CASCADE;
DROP TABLE IF EXISTS respuesta CASCADE;
DROP TABLE IF EXISTS derivacion CASCADE;
DROP TABLE IF EXISTS documento CASCADE;
DROP TABLE IF EXISTS tipo_respuesta CASCADE;
DROP TABLE IF EXISTS estado_documento CASCADE;
DROP TABLE IF EXISTS tipo_documento CASCADE;
DROP TABLE IF EXISTS remitente CASCADE;
DROP TABLE IF EXISTS empleado CASCADE;
DROP TABLE IF EXISTS cargo CASCADE;
DROP TABLE IF EXISTS area CASCADE;

-- 2. Creación de Catálogos y Entidades Independientes

CREATE TABLE area (
    id_area SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE cargo (
    id_cargo SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE empleado (
    id_empleado SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    id_area INT,
    id_cargo INT NOT NULL,
    CONSTRAINT fk_empleado_area FOREIGN KEY (id_area) REFERENCES area(id_area) ON DELETE SET NULL,
    CONSTRAINT fk_empleado_cargo FOREIGN KEY (id_cargo) REFERENCES cargo(id_cargo) ON DELETE RESTRICT
);

CREATE TABLE remitente (
    id_remitente SERIAL PRIMARY KEY,
    nombre_institucion VARCHAR(200) NOT NULL,
    tipo_entidad VARCHAR(50) NOT NULL, -- Ej: 'Cliente', 'Proveedor', 'Estado'
    ruc_dni VARCHAR(20) UNIQUE,
    correo_contacto VARCHAR(150),
    telefono VARCHAR(50)
);

CREATE TABLE tipo_documento (
    id_tipo_documento SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL -- Ej: 'Carta', 'Oficio', 'Factura'
);

CREATE TABLE estado_documento (
    id_estado_documento SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL -- Ej: 'Pendiente', 'Derivado', 'Respondido', 'Archivado'
);

CREATE TABLE tipo_respuesta (
    id_tipo_respuesta SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL -- Ej: 'Aprobación', 'Rechazo', 'Observación', 'Informativo'
);

CREATE TABLE palabra_clave (
    id_palabra SERIAL PRIMARY KEY,
    palabra VARCHAR(50) UNIQUE NOT NULL
);

-- 3. Creación de Entidad Principal: Documento

CREATE TABLE documento (
    id_documento SERIAL PRIMARY KEY,
    correlativo VARCHAR(30) UNIQUE NOT NULL, -- Ej: DOC-2026-0001
    id_remitente INT NOT NULL,
    id_tipo_documento INT NOT NULL,
    id_estado_documento INT NOT NULL,
    fecha_recepcion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    motivo VARCHAR(255) NOT NULL,
    asunto TEXT,
    requiere_respuesta BOOLEAN NOT NULL DEFAULT TRUE,
    observaciones TEXT,
    archivo_url VARCHAR(500), -- Ruta o URL en Supabase Storage
    CONSTRAINT fk_doc_remitente FOREIGN KEY (id_remitente) REFERENCES remitente(id_remitente) ON DELETE RESTRICT,
    CONSTRAINT fk_doc_tipo FOREIGN KEY (id_tipo_documento) REFERENCES tipo_documento(id_tipo_documento) ON DELETE RESTRICT,
    CONSTRAINT fk_doc_estado FOREIGN KEY (id_estado_documento) REFERENCES estado_documento(id_estado_documento) ON DELETE RESTRICT
);

-- 4. Creación de Tablas Transaccionales y de Relación

CREATE TABLE derivacion (
    id_derivacion SERIAL PRIMARY KEY,
    id_documento INT NOT NULL,
    emisor_id INT NOT NULL,
    receptor_id INT NOT NULL,
    fecha_derivacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    instrucciones TEXT,
    CONSTRAINT fk_der_documento FOREIGN KEY (id_documento) REFERENCES documento(id_documento) ON DELETE CASCADE,
    CONSTRAINT fk_der_emisor FOREIGN KEY (emisor_id) REFERENCES empleado(id_empleado) ON DELETE RESTRICT,
    CONSTRAINT fk_der_receptor FOREIGN KEY (receptor_id) REFERENCES empleado(id_empleado) ON DELETE RESTRICT
);

CREATE TABLE respuesta (
    id_respuesta SERIAL PRIMARY KEY,
    id_documento INT UNIQUE NOT NULL, -- Relación 1:1, un documento tiene una respuesta final
    id_tipo_respuesta INT NOT NULL,
    id_empleado_autor INT NOT NULL, -- Quién emitió la respuesta
    fecha_respuesta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    descripcion TEXT NOT NULL,
    archivo_adjunto_url VARCHAR(500),
    CONSTRAINT fk_resp_documento FOREIGN KEY (id_documento) REFERENCES documento(id_documento) ON DELETE CASCADE,
    CONSTRAINT fk_resp_tipo FOREIGN KEY (id_tipo_respuesta) REFERENCES tipo_respuesta(id_tipo_respuesta) ON DELETE RESTRICT,
    CONSTRAINT fk_resp_empleado FOREIGN KEY (id_empleado_autor) REFERENCES empleado(id_empleado) ON DELETE RESTRICT
);

CREATE TABLE documento_palabra_clave (
    id_documento INT NOT NULL,
    id_palabra INT NOT NULL,
    PRIMARY KEY (id_documento, id_palabra),
    CONSTRAINT fk_dp_documento FOREIGN KEY (id_documento) REFERENCES documento(id_documento) ON DELETE CASCADE,
    CONSTRAINT fk_dp_palabra FOREIGN KEY (id_palabra) REFERENCES palabra_clave(id_palabra) ON DELETE CASCADE
);

-- 5. Índices de rendimiento para búsquedas comunes
CREATE INDEX idx_documento_correlativo ON documento(correlativo);
CREATE INDEX idx_documento_fecha ON documento(fecha_recepcion);
CREATE INDEX idx_derivacion_receptor ON derivacion(receptor_id);
CREATE INDEX idx_derivacion_documento ON derivacion(id_documento);
