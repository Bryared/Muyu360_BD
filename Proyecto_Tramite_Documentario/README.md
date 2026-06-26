# 🏛️ Proyecto Integrador: Sistema de Gestión de Trámite Documentario para Mypes Agroexportadoras ("MuyuAgro")
### **Universidad Nacional Agraria La Molina (UNALM)**  
*Facultad de Economía y Planificación — Departamento Académico de Estadística e Informática*  
**Curso:** Sistemas de Gestión de Base de Datos I (Ciclo V — Semestre 2026-I)  
**Docentes:** MSc. Ivan Soto Rodriguez / MSc. Beatriz Montaño  

---

## 👥 1. Portafolio Académico del Grupo de Investigación (Grupo 04)

El proyecto ha sido desarrollado bajo una **metodología de participación cooperativa del 100%**, donde cada integrante lideró un componente crítico del sistema de acuerdo a las competencias del sílabo:

| Integrante | Rol Principal | Tarea Específica | Contribución Clave |
| :--- | :--- | :--- | :--- |
| **Gabriel** | Líder de Procesos | Tarea 1: Bizagi | Modelado del flujo de datos inicial en BPMN (Bizagi), mapeo de carriles (Lanes) y análisis del ciclo de vida del documento. |
| **Jeremi** | Líder de Estructura | Tarea 2: Diccionario | Diseño técnico del Diccionario de Datos, definición de dominios, tipos de datos PostgreSQL y restricciones de integridad. |
| **Dana** | Líder de Modelado | Tarea 3: MER | Elaboración conceptual y diagramación del Modelo Entidad-Relación (MER), definición de relaciones y cardinalidades. |
| **Megumi** | Líder de Base de Datos | Tarea 4: SQL y Normalización | Redacción del Script SQL (DDL/DML) y normalización científica de la base de datos a la Tercera Forma Normal (3FN) y Boyce-Codd. |
| **Dayvi** | Líder de Frontend | Tarea 5: Interfaz (UX) | Desarrollo de la interfaz gráfica SPA en React 19, TypeScript y sistema visual minimalista con la paleta de la marca. |
| **Bryan** | Líder de Arquitectura | Tarea 6: Backend y Conexión | Desarrollo de las APIs REST en Spring Boot 3.x, persistencia JPA con Hibernate, transacciones atómicas y conectividad a Supabase. |

---

## 🏗️ 2. Arquitectura de Software Desacoplada (3 Capas)

El sistema implementa una arquitectura desacoplada y robusta que separa de manera estricta la presentación, la lógica y los datos:

```mermaid
graph TD
    subgraph CapaVisual [1. CAPA DE PRESENTACIÓN - FRONTEND]
        React[React 19 SPA + TS]
        Tailwind[Tailwind CSS v4]
        React --> Tailwind
    end
    
    subgraph CapaLogica [2. CAPA DE LÓGICA DE NEGOCIO - BACKEND]
        SpringBoot[Spring Boot 3.x REST API]
        JPA[Spring Data JPA + Hibernate]
        SpringBoot --> JPA
    end
    
    subgraph CapaDatos [3. CAPA DE PERSISTENCIA - DATOS]
        Supabase[Supabase Cloud]
        Postgres[(PostgreSQL 3FN)]
        Supabase --> Postgres
    end

    React -- "Peticiones HTTP (Axios)" --> SpringBoot
    JPA -- "Conexión JDBC (HikariCP)" --> Supabase
```

---

## 📊 3. Modelo de Datos Físico (DER)

A continuación se presenta el **Diagrama Entidad-Relación Físico (DER)** de la base de datos en Supabase, modelado en la nube en **Tercera Forma Normal (3NF)**:

```mermaid
erDiagram
    area {
        INT id_area PK
        VARCHAR nombre "NOT NULL"
        TEXT descripcion "NULL"
    }

    cargo {
        INT id_cargo PK
        VARCHAR nombre "NOT NULL"
    }

    empleado {
        INT id_empleado PK
        VARCHAR nombre "NOT NULL"
        VARCHAR apellidos "NOT NULL"
        VARCHAR email UK "NOT NULL"
        INT id_area FK "NULL"
        INT id_cargo FK "NOT NULL"
    }

    remitente {
        INT id_remitente PK
        VARCHAR nombre_institucion "NOT NULL"
        VARCHAR tipo_entidad "NOT NULL"
        VARCHAR ruc_dni UK "NULL"
        VARCHAR correo_contacto "NULL"
        VARCHAR telefono "NULL"
    }

    tipo_documento {
        INT id_tipo_documento PK
        VARCHAR nombre "NOT NULL"
    }

    estado_documento {
        INT id_estado_documento PK
        VARCHAR nombre "NOT NULL"
    }

    tipo_respuesta {
        INT id_tipo_respuesta PK
        VARCHAR nombre "NOT NULL"
    }

    palabra_clave {
        INT id_palabra PK
        VARCHAR palabra UK "NOT NULL"
    }

    documento {
        INT id_documento PK
        VARCHAR correlativo UK "NOT NULL"
        INT id_remitente FK "NOT NULL"
        INT id_tipo_documento FK "NOT NULL"
        INT id_estado_documento FK "NOT NULL"
        TIMESTAMP fecha_recepcion "NOT NULL"
        VARCHAR motivo "NOT NULL"
        TEXT asunto "NULL"
        BOOLEAN requiere_respuesta "NOT NULL"
        TEXT observaciones "NULL"
        VARCHAR archivo_url "NULL"
    }

    derivacion {
        INT id_derivacion PK
        INT id_documento FK "NOT NULL"
        INT emisor_id FK "NOT NULL"
        INT receptor_id FK "NOT NULL"
        TIMESTAMP fecha_derivacion "NOT NULL"
        TEXT instrucciones "NULL"
    }

    respuesta {
        INT id_respuesta PK
        INT id_documento FK "UK, NOT NULL"
        INT id_tipo_respuesta FK "NOT NULL"
        INT id_empleado_autor FK "NOT NULL"
        TIMESTAMP fecha_respuesta "NOT NULL"
        TEXT descripcion "NOT NULL"
        VARCHAR archivo_adjunto_url "NULL"
    }

    documento_palabra_clave {
        INT id_documento PK, FK "NOT NULL"
        INT id_palabra PK, FK "NOT NULL"
    }

    %% Relaciones de Cardinalidad
    area ||--o{ empleado : "alberga (1:N)"
    cargo ||--|{ empleado : "asigna (1:N)"
    empleado ||--o{ derivacion : "emite (1:N)"
    empleado ||--o{ derivacion : "recibe (1:N)"
    empleado ||--o{ respuesta : "redacta (1:N)"
    remitente ||--|{ documento : "remite (1:N)"
    tipo_documento ||--|{ documento : "clasifica (1:N)"
    estado_documento ||--|{ documento : "califica (1:N)"
    documento ||--|{ derivacion : "traza (1:N)"
    documento ||--o| respuesta : "cierra (1:1)"
    documento ||--|{ documento_palabra_clave : "asocia (1:N)"
    palabra_clave ||--|{ documento_palabra_clave : "etiqueta (1:N)"
```

### 🖼️ Visualización del Esquema Relacional (Supabase Cloud)

Para mayor detalle de las restricciones físicas de la base de datos de producción, se anexa la captura del visualizador de esquemas de Supabase:

![Esquema Físico de Base de Datos - Supabase](./database/schema_visualizer.png)

> [!TIP]
> **Instrucción para el Alumno:** Toma captura a la pantalla del visualizador de esquemas de Supabase y guárdala exactamente con el nombre `schema_visualizer.png` dentro de la carpeta `database/` del proyecto para que la imagen se renderice automáticamente en esta sección del README en GitHub.

---

## 📈 4. Mapa Completo del Flujo Transaccional (9 Subprocesos)

El siguiente diagrama de flujo modela de forma exhaustiva el comportamiento transaccional del sistema, mapeando las interacciones del frontend, las peticiones HTTP REST, la lógica del backend en Spring Boot y la persistencia atómica en PostgreSQL:

```mermaid
graph TD
    %% 1. ACCESO
    subgraph Acceso["1. ACCESO Y CONTEXTO DE USUARIO"]
        A1([Usuario abre la app React]) --> A2[Login demo o selección de perfil]
        A2 --> A3[GET /api/empleados]
        A3 --> A4{¿Backend disponible?}
        A4 -- Sí --> A5[Cargar empleados reales desde Supabase Postgres]
        A4 -- No --> A6[Modo local con datos semilla]
        A5 --> A7[Guardar id_empleado y rol en memoria]
        A6 --> A7
    end

    %% 2. DASHBOARD
    subgraph Dashboard["2. DASHBOARD Y BANDEJA"]
        A7 --> D1[GET /api/documentos]
        D1 --> D2[Mostrar KPIs: pendientes, respondidos, archivados]
        D2 --> D3[Mostrar últimos documentos]
        D3 --> D4[Ir a Registrar]
        D3 --> D5[Ir a Buscar]
        D3 --> D6[Ir a Seguimiento]
        D3 --> D7[Ir a Empleados]
        D3 --> D8[Ir a Tipos de documento]
    end

    %% 3. REGISTRO
    subgraph Registro["3. REGISTRO DE TRÁMITE"]
        D4 --> R1[Abrir formulario Registrar Documento]
        R1 --> R2[Ingresar formato, tipo, emisor, receptor, motivo y fecha]
        R2 --> R3[Adjuntar archivo físico escaneado o digital]
        R3 --> R4[Agregar palabras clave]
        R4 --> R5[Jefe define proveído oficial, destinatario e instrucciones]
        R5 --> R6[POST /api/documentos]
    end

    %% 4. BACKEND
    subgraph Backend["4. SPRING BOOT Y REGLAS DE NEGOCIO"]
        R6 --> B1[Recibir DTO y abrir transacción]
        B1 --> B2[Validar remitente, tipo, receptor y empleado destino]
        B2 --> B3[Generar correlativo único]
        B3 --> B4[Cargar URL de almacenamiento del archivo]
        B4 --> B5[Insertar en tabla documento]
        B5 --> B6[Insertar primer registro en derivacion]
        B6 --> B7[Insertar palabras clave en tabla intermedia]
        B7 --> B8[Asignar estado inicial Pendiente]
        B8 --> B9{¿Persistencia correcta?}
        B9 -- No --> B10[Rollback y error]
        B9 -- Sí --> B11[Commit y respuesta 201]
    end

    %% 5. PERSISTENCIA
    subgraph Persistencia["5. SUPABASE POSTGRESQL Y STORAGE"]
        B11 --> P1[(documento)]
        B11 --> P2[(derivacion)]
        B11 --> P3[(respuesta)]
        B11 --> P4[(empleado)]
        B11 --> P5[(tipo_documento)]
        B11 --> P6[(estado_documento)]
        B11 --> P7[(palabra_clave)]
        B11 --> P8[(documento_palabra_clave)]
        B4 --> P9[(bucket documentos)]
    end

    %% 6. BÚSQUEDA
    subgraph Busqueda["6. BÚSQUEDA AVANZADA"]
        D5 --> Q1[Abrir módulo de búsqueda]
        Q1 --> Q2[Filtrar por fecha]
        Q1 --> Q3[Filtrar por motivo]
        Q1 --> Q4[Filtrar por remitente]
        Q1 --> Q5[Filtrar por tipo de documento]
        Q1 --> Q6[Filtrar por palabras clave]
        Q2 --> Q7[GET /api/documentos]
        Q3 --> Q7
        Q4 --> Q7
        Q5 --> Q7
        Q6 --> Q7
        Q7 --> Q8[Mostrar resultados]
        Q8 --> Q9[Ver detalle del documento]
    end

    %% 7. SEGUIMIENTO
    subgraph Seguimiento["7. SEGUIMIENTO Y TRAZABILIDAD"]
        D6 --> T1[Buscar por correlativo]
        Q9 --> T1
        T1 --> T2[GET /api/documentos]
        T2 --> T3[GET /api/derivaciones/documento/id]
        T3 --> T4[JOIN entre documento, derivación, respuesta y empleado]
        T4 --> T5[Mostrar línea de tiempo del expediente]
        T5 --> T6{¿Requiere nueva derivación?}
        T6 -- Sí --> T7[POST /api/derivaciones]
        T7 --> B1
        T6 -- No --> T8[Continuar atención]
    end

    %% 8. RESPUESTA O ARCHIVO
    subgraph Cierre["8. RESPUESTA, TIPO DE RESPUESTA Y ARCHIVO"]
        T8 --> C1{¿El tipo documental requiere respuesta?}
        C1 -- No --> C2[Archivar documento]
        C2 --> C3[Actualizar estado a Archivado]
        C3 --> C4[Registrar movimiento final]
        C4 --> C9([Fin del trámite])

        C1 -- Sí --> C5[Abrir formulario Registrar Respuesta]
        C5 --> C6[Ingresar tipo de respuesta, contenido y sustento]
        C6 --> C7[POST /api/respuestas]
        C7 --> S1[Backend abre transacción resolutiva]
        S1 --> S2[Insertar en tabla respuesta]
        S2 --> S3[Actualizar estado a Respondido]
        S3 --> S4[Registrar movimiento final]
        S4 --> S5[Refrescar dashboard y seguimiento]
        S5 --> C9
    end

    %% 9. CATÁLOGOS
    subgraph Catalogos["9. CATÁLOGOS ADMINISTRABLES"]
        D7 --> E1[GET /api/empleados]
        E1 --> E2[Crear o editar empleado]
        D8 --> F1[GET /api/tipos-documento]
        F1 --> F2[Crear o editar tipo documental]
        F2 --> F3[Definir si requiere respuesta]
    end
```

---

## 💎 5. Valor Agregado Académico y Creatividad

1. **Trazabilidad Absoluta en Tiempo Real:** El sistema permite rastrear la cadena de custodia del documento, mostrando un *timeline* interactivo que indica qué funcionario lo tiene, cuándo lo recibió y qué instrucciones de proveído redactó.
2. **Inicio de Sesión Multiusuario Dinámico:** El sistema no simula una sesión estática. Carga los perfiles reales desde Supabase y adapta el menú y las firmas de los proveídos automáticamente con el ID del empleado registrado en base de datos.
3. **Resiliencia Local (Offline Graceful Fallback):** Si la base de datos en la nube está desconectada, la app React detecta el estado y activa de inmediato un simulador local alimentado por los datos semilla del script `data.sql`, garantizando que la demostración en vivo nunca falle.

---

## 🚀 6. Guía Máster de Instalación y Despliegue

### Requisitos Previos
*   **Java Development Kit (JDK):** Versión 17 o superior.
*   **Apache Maven:** Versión 3.9.x o superior.
*   **Node.js:** Versión 20.x o superior.
*   **Base de Datos:** Cuenta activa en [Supabase](https://supabase.com/).

### Paso 1: Configurar Base de Datos en Supabase
1. Crea un nuevo proyecto en Supabase llamado `MuyuAgro-DB`.
2. Ve a la sección **SQL Editor** en el menú lateral.
3. Crea un **New Query**, pega el contenido de [schema.sql](file:///c:/Users/bryan/Muyu360_BD/Proyecto_Tramite_Documentario/database/schema.sql) y presiona **Run**.
4. Crea otro Query, pega el contenido de [data.sql](file:///c:/Users/bryan/Muyu360_BD/Proyecto_Tramite_Documentario/database/data.sql) y presiona **Run** para cargar el personal y catálogos semilla.

### Paso 2: Ejecutar el Servidor Backend (Spring Boot)
1. Dirígete a la carpeta del backend en la terminal:
   ```bash
   cd backend
   ```
2. Configura las credenciales en el archivo `src/main/resources/application.yml` colocando el Host, Puerto y la contraseña de Supabase, o a través de variables de entorno.
3. Compila y ejecuta el servidor:
   ```bash
   mvn clean compile
   mvn spring-boot:run
   ```
   *El servidor iniciará en el puerto `8080` de manera local.*

### Paso 3: Ejecutar el Cliente Frontend (React 19)
1. Abre una nueva terminal y dirígete a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias y arranca el servidor de desarrollo:
   ```bash
   npm install
   npm run dev
   ```
3. Accede a la URL indicada (usualmente `http://localhost:5173` o `http://localhost:5175`).

---

**Lima, 2026**  
**Universidad Nacional Agraria La Molina**  
*Dpto. de Estadística e Informática*  
*Proyecto con fines de investigación académica*  
