-- ==============================================================
-- SISTEMA DE TRÁMITE DOCUMENTARIO - SCRIPT DML (Seeders)
-- BASE DE DATOS: PostgreSQL
-- ==============================================================

-- 1. Insertar Áreas
INSERT INTO area (nombre, descripcion) VALUES
('Mesa de Partes', 'Recepción central de documentos'),
('Gerencia General', 'Dirección estratégica de la Mype'),
('Logística', 'Gestión de envíos y agroexportación'),
('Contabilidad', 'Gestión financiera y facturación'),
('Recursos Humanos', 'Gestión de personal');

-- 2. Insertar Cargos
INSERT INTO cargo (nombre) VALUES
('Secretario/a'),
('Gerente'),
('Jefe de Operaciones'),
('Asistente Administrativo'),
('Especialista de Aduanas');

-- 3. Insertar Empleados
INSERT INTO empleado (nombre, apellidos, email, id_area, id_cargo) VALUES
('Ana', 'García', 'ana.garcia@agroexport.com', 1, 1),
('Carlos', 'Ramírez', 'carlos.ramirez@agroexport.com', 2, 2),
('Luis', 'Fernández', 'luis.fernandez@agroexport.com', 3, 3),
('María', 'Torres', 'maria.torres@agroexport.com', 4, 4),
('Elena', 'Vásquez', 'elena.vasquez@agroexport.com', 3, 5);

-- 4. Insertar Remitentes
INSERT INTO remitente (nombre_institucion, tipo_entidad, ruc_dni, correo_contacto, telefono) VALUES
('SENASA', 'Estado', '20131370645', 'mesadepartes@senasa.gob.pe', '01-313-3300'),
('MIDAGRI', 'Estado', '20131372931', 'contacto@midagri.gob.pe', '01-209-8600'),
('AgroLogistics SAC', 'Proveedor', '20543219876', 'operaciones@agrologistics.com', '987654321'),
('EuroFoods Ltd', 'Cliente', 'GB123456789', 'purchasing@eurofoods.co.uk', '+44 20 7123 4567'),
('Juan Pérez', 'Persona Natural', '10456789', 'jperez@gmail.com', '999888777');

-- 5. Insertar Tipos de Documento
INSERT INTO tipo_documento (nombre) VALUES
('Carta'),
('Oficio'),
('Resolución Directoral'),
('Certificado Fitosanitario'),
('Factura Comercial'),
('Packing List'),
('Solicitud');

-- 6. Insertar Estados de Documento
INSERT INTO estado_documento (nombre) VALUES
('Pendiente'),
('Derivado'),
('En Proceso'),
('Respondido'),
('Archivado');

-- 7. Insertar Tipos de Respuesta
INSERT INTO tipo_respuesta (nombre) VALUES
('Aprobación'),
('Rechazo'),
('Observación'),
('Informativo'),
('Conformidad');

-- 8. Insertar Palabras Clave
INSERT INTO palabra_clave (palabra) VALUES
('Urgente'),
('Exportación'),
('Inspección'),
('Pago'),
('Aduanas'),
('Auditoría'),
('Palta Hass'),
('Mango');

-- 9. Insertar Documentos (Muestra reducida)
INSERT INTO documento (correlativo, id_remitente, id_tipo_documento, id_estado_documento, fecha_recepcion, motivo, asunto, requiere_respuesta, observaciones) VALUES
('DOC-2026-0001', 1, 4, 2, '2026-06-01 09:00:00', 'Certificación Palta', 'Emisión de Certificado Fitosanitario Lote A', TRUE, 'Requiere revisión logística'),
('DOC-2026-0002', 4, 6, 4, '2026-06-02 10:30:00', 'Envío Europa', 'Packing List Contenedor 123', TRUE, ''),
('DOC-2026-0003', 2, 3, 5, '2026-06-03 14:15:00', 'Normativa', 'Nueva resolución sobre exportación agrícola', FALSE, 'Solo para archivo y conocimiento general'),
('DOC-2026-0004', 3, 5, 1, '2026-06-05 11:45:00', 'Cobro de flete', 'Factura F001-999 por servicios aduaneros', TRUE, 'Derivar a contabilidad'),
('DOC-2026-0005', 1, 2, 3, '2026-06-10 16:20:00', 'Notificación Inspección', 'Visita programada a planta empacadora', TRUE, 'Urgente');

-- 10. Insertar Derivaciones (Proveídos)
-- Derivar DOC-1 a Logística (Luis)
INSERT INTO derivacion (id_documento, emisor_id, receptor_id, fecha_derivacion, instrucciones) VALUES
(1, 1, 3, '2026-06-01 09:30:00', 'Revisar certificado y confirmar pesos');
-- Derivar DOC-2 a Gerencia, y luego de Gerencia a Aduanas
INSERT INTO derivacion (id_documento, emisor_id, receptor_id, fecha_derivacion, instrucciones) VALUES
(2, 1, 2, '2026-06-02 11:00:00', 'Para su Visto Bueno'),
(2, 2, 5, '2026-06-02 15:00:00', 'Proceder con trámite aduanero');
-- Derivar DOC-5 a Gerencia
INSERT INTO derivacion (id_documento, emisor_id, receptor_id, fecha_derivacion, instrucciones) VALUES
(5, 1, 2, '2026-06-10 16:30:00', 'Atención inmediata de inspección');

-- 11. Insertar Respuestas
-- Respuesta final para el DOC-2
INSERT INTO respuesta (id_documento, id_tipo_respuesta, id_empleado_autor, fecha_respuesta, descripcion) VALUES
(2, 5, 5, '2026-06-03 10:00:00', 'Trámite aduanero completado con éxito, contenedor en camino.');

-- 12. Insertar Relación Documento - Palabras Clave
INSERT INTO documento_palabra_clave (id_documento, id_palabra) VALUES
(1, 2), -- Exportación
(1, 7), -- Palta Hass
(2, 2), -- Exportación
(3, 8), -- Mango
(4, 4), -- Pago
(5, 1), -- Urgente
(5, 3); -- Inspección
