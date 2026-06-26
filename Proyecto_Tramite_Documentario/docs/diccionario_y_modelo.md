# Modelo Entidad-Relación y Diccionario de Datos

Este documento define la estructura de datos del Sistema Relacional de Trámite Documentario, asegurando la trazabilidad y la integridad de las transacciones (hasta 3FN).

## 1. Diagrama Entidad-Relación (E-R)

A continuación se muestra la representación lógica de la base de datos usando `mermaid`:

```mermaid
erDiagram
    %% Catálogos y Entidades Independientes
    AREA {
        int id_area PK
        string nombre
        string descripcion
    }
    CARGO {
        int id_cargo PK
        string nombre
    }
    REMITENTE {
        int id_remitente PK
        string nombre_institucion
        string tipo_entidad
        string ruc_dni UK
        string correo_contacto
        string telefono
    }
    TIPO_DOCUMENTO {
        int id_tipo_documento PK
        string nombre
    }
    ESTADO_DOCUMENTO {
        int id_estado_documento PK
        string nombre
    }
    TIPO_RESPUESTA {
        int id_tipo_respuesta PK
        string nombre
    }
    PALABRA_CLAVE {
        int id_palabra PK
        string palabra UK
    }

    %% Entidad Empleado
    EMPLEADO {
        int id_empleado PK
        string nombre
        string apellidos
        string email UK
        int id_area FK
        int id_cargo FK
    }

    %% Entidad Central Documento
    DOCUMENTO {
        int id_documento PK
        string correlativo UK
        int id_remitente FK
        int id_tipo_documento FK
        int id_estado_documento FK
        timestamp fecha_recepcion
        string motivo
        string asunto
        boolean requiere_respuesta
        string observaciones
        string archivo_url
    }

    %% Relaciones Transaccionales
    DERIVACION {
        int id_derivacion PK
        int id_documento FK
        int emisor_id FK
        int receptor_id FK
        timestamp fecha_derivacion
        string instrucciones
    }

    RESPUESTA {
        int id_respuesta PK
        int id_documento FK UK
        int id_tipo_respuesta FK
        int id_empleado_autor FK
        timestamp fecha_respuesta
        string descripcion
        string archivo_adjunto_url
    }

    DOCUMENTO_PALABRA_CLAVE {
        int id_documento PK,FK
        int id_palabra PK,FK
    }

    %% Relaciones
    AREA ||--o{ EMPLEADO : "tiene"
    CARGO ||--o{ EMPLEADO : "asigna a"
    
    REMITENTE ||--o{ DOCUMENTO : "envía"
    TIPO_DOCUMENTO ||--o{ DOCUMENTO : "clasifica a"
    ESTADO_DOCUMENTO ||--o{ DOCUMENTO : "define estado de"
    
    DOCUMENTO ||--o{ DERIVACION : "es derivado en"
    EMPLEADO ||--o{ DERIVACION : "emite"
    EMPLEADO ||--o{ DERIVACION : "recibe"
    
    DOCUMENTO ||--o| RESPUESTA : "tiene"
    TIPO_RESPUESTA ||--o{ RESPUESTA : "clasifica"
    EMPLEADO ||--o{ RESPUESTA : "autoriza"

    DOCUMENTO ||--o{ DOCUMENTO_PALABRA_CLAVE : "se asocia con"
    PALABRA_CLAVE ||--o{ DOCUMENTO_PALABRA_CLAVE : "describe"
```

---

## 2. Diccionario de Datos

### 2.1 Tablas Catálogo e Independientes

#### Tabla `area`
| Campo | Tipo | Nulo | PK/FK | Descripción |
|-------|------|------|-------|-------------|
| id_area | SERIAL | NO | PK | Identificador único del área |
| nombre | VARCHAR(100) | NO | | Nombre del área |
| descripcion | TEXT | SI | | Breve descripción de sus funciones |

#### Tabla `cargo`
| Campo | Tipo | Nulo | PK/FK | Descripción |
|-------|------|------|-------|-------------|
| id_cargo | SERIAL | NO | PK | Identificador único del cargo |
| nombre | VARCHAR(100) | NO | | Nombre del cargo |

#### Tabla `tipo_documento`
| Campo | Tipo | Nulo | PK/FK | Descripción |
|-------|------|------|-------|-------------|
| id_tipo_documento | SERIAL | NO | PK | Identificador único del tipo |
| nombre | VARCHAR(100) | NO | | Ejemplo: 'Carta', 'Oficio', 'Factura' |

#### Tabla `estado_documento`
| Campo | Tipo | Nulo | PK/FK | Descripción |
|-------|------|------|-------|-------------|
| id_estado_documento | SERIAL | NO | PK | Identificador único |
| nombre | VARCHAR(50) | NO | | Estado ('Pendiente', 'Derivado', etc) |

#### Tabla `tipo_respuesta`
| Campo | Tipo | Nulo | PK/FK | Descripción |
|-------|------|------|-------|-------------|
| id_tipo_respuesta | SERIAL | NO | PK | Identificador único |
| nombre | VARCHAR(100) | NO | | Tipo ('Aprobación', 'Rechazo', etc) |

#### Tabla `palabra_clave`
| Campo | Tipo | Nulo | PK/FK | Descripción |
|-------|------|------|-------|-------------|
| id_palabra | SERIAL | NO | PK | Identificador único |
| palabra | VARCHAR(50) | NO | | UNIQUE. Palabra clave de búsqueda |

#### Tabla `remitente`
| Campo | Tipo | Nulo | PK/FK | Descripción |
|-------|------|------|-------|-------------|
| id_remitente | SERIAL | NO | PK | Identificador único del remitente |
| nombre_institucion | VARCHAR(200) | NO | | Nombre de la entidad o persona |
| tipo_entidad | VARCHAR(50) | NO | | ('Cliente', 'Proveedor', 'Estado', etc) |
| ruc_dni | VARCHAR(20) | SI | | UNIQUE. Número de documento de identidad |
| correo_contacto | VARCHAR(150) | SI | | Correo electrónico principal |
| telefono | VARCHAR(50) | SI | | Número de contacto |

### 2.2 Tablas Principales

#### Tabla `empleado`
| Campo | Tipo | Nulo | PK/FK | Descripción |
|-------|------|------|-------|-------------|
| id_empleado | SERIAL | NO | PK | Identificador único |
| nombre | VARCHAR(150) | NO | | Nombres del empleado |
| apellidos | VARCHAR(150) | NO | | Apellidos del empleado |
| email | VARCHAR(150) | NO | | UNIQUE. Correo institucional |
| id_area | INT | SI | FK -> area | Área a la que pertenece (NULL = independiente) |
| id_cargo | INT | NO | FK -> cargo | Cargo que desempeña |

#### Tabla `documento` (Entidad Central)
| Campo | Tipo | Nulo | PK/FK | Descripción |
|-------|------|------|-------|-------------|
| id_documento | SERIAL | NO | PK | Identificador único autonumérico |
| correlativo | VARCHAR(30) | NO | | UNIQUE. Índice generado (Ej: DOC-2026-0001) |
| id_remitente | INT | NO | FK -> remitente | Entidad externa que origina el trámite |
| id_tipo_documento | INT | NO | FK -> tipo_documento | Tipo del documento |
| id_estado_documento | INT | NO | FK -> estado_documento | Estado actual del trámite |
| fecha_recepcion | TIMESTAMP | NO | | Fecha y hora de registro (Default: NOW) |
| motivo | VARCHAR(255) | NO | | Razón corta del trámite |
| asunto | TEXT | SI | | Descripción detallada |
| requiere_respuesta | BOOLEAN | NO | | TRUE si se debe responder para poder archivar |
| observaciones | TEXT | SI | | Anotaciones extras de recepción |
| archivo_url | VARCHAR(500) | SI | | Enlace o Path del PDF en Storage |

#### Tabla `derivacion` (Transaccional)
| Campo | Tipo | Nulo | PK/FK | Descripción |
|-------|------|------|-------|-------------|
| id_derivacion | SERIAL | NO | PK | Identificador único del movimiento |
| id_documento | INT | NO | FK -> documento | Documento que se deriva |
| emisor_id | INT | NO | FK -> empleado | Quién hace el proveído |
| receptor_id | INT | NO | FK -> empleado | A quién se le asigna el documento |
| fecha_derivacion | TIMESTAMP | NO | | Fecha del movimiento (Default: NOW) |
| instrucciones | TEXT | SI | | Órdenes o indicaciones del proveído |

#### Tabla `respuesta` (Transaccional)
| Campo | Tipo | Nulo | PK/FK | Descripción |
|-------|------|------|-------|-------------|
| id_respuesta | SERIAL | NO | PK | Identificador único |
| id_documento | INT | NO | FK -> documento | UNIQUE. El documento que se responde (Rel 1:1) |
| id_tipo_respuesta | INT | NO | FK -> tipo_respuesta | Clasificación de la respuesta |
| id_empleado_autor | INT | NO | FK -> empleado | Quién redactó/autorizó la respuesta |
| fecha_respuesta | TIMESTAMP | NO | | Fecha y hora (Default: NOW) |
| descripcion | TEXT | NO | | Contenido o sustento de la respuesta |
| archivo_adjunto_url | VARCHAR(500)| SI | | PDF o documento probatorio adjunto |

#### Tabla `documento_palabra_clave` (Tabla Intermedia N:M)
| Campo | Tipo | Nulo | PK/FK | Descripción |
|-------|------|------|-------|-------------|
| id_documento | INT | NO | PK/FK -> doc | Clave compuesta |
| id_palabra | INT | NO | PK/FK -> palabra | Clave compuesta |
