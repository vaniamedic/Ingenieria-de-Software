--Para poner en la bbdd

-- Creación de los tipos ENUM para mayor integridad de datos
CREATE TYPE estado_proyecto_enum AS ENUM (
    'Iniciado', 
    'En Desarrollo', 
    'Subido a SEIM', 
    'En Corrección', 
    'En Evaluación SEREMITT', 
    'Aprobado', 
    'Rechazado'
);

CREATE TYPE tipo_alerta_enum AS ENUM (
    'retraso_critico', 
    'vencimiento_proximo', 
    'seremitt_urgente'
);

CREATE TYPE severidad_alerta_enum AS ENUM (
    'critico',
    'advertencia',
    'exito',
    'informativa'
);

CREATE TABLE proyectos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL, -- El código único que se genera automáticamente
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('Básico', 'Intermedio', 'Mayor')),
    cliente VARCHAR(150) NOT NULL,
    ubicacion TEXT NOT NULL,
    estado estado_proyecto_enum NOT NULL DEFAULT 'Iniciado'
    --Iniciado, En Desarrollo, Subido a SEIM, En Corrección, En Evaluación SEREMIT, Aprobado, Rechazado
    
    -- Fechas cruciales
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_compromiso DATE NOT NULL,
    
    -- Estimaciones
    estimacion_inicial_dias INTEGER NOT NULL,
    estimacion_ajustada_dias INTEGER,
    justificacion_ajuste TEXT,
    
    -- Seguimiento
    avance FLOAT DEFAULT 0.0, -- Porcentaje de 0 a 100
    
    -- Relación con el profesional (puede que un proyecto tenga un líder principal)
    profesional_lider_id INTEGER REFERENCES profesionales(id) ON DELETE SET NULL
);


--Para las fases
CREATE TABLE fases (
    id SERIAL PRIMARY KEY,
    proyecto_id INTEGER NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE, -- Si se borra el proyecto, se borran sus fases
    nombre VARCHAR(255) NOT NULL,
    orden INTEGER NOT NULL, -- Para mantener la secuencia correcta de las fases
    fase_completada BOOLEAN DEFAULT FALSE,
    fecha_inicio_real DATE,
    fecha_fin_real DATE
);

--Plazos SEREMITT
CREATE TABLE observaciones_seremitt (
    id SERIAL PRIMARY KEY,
    proyecto_id INTEGER NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    ciclo INT NOT NULL DEFAULT 1, -- Ciclo de corrección 1, 2, etc.
    etapa_actual VARCHAR(100),
    fecha_recepcion_observaciones DATE NOT NULL,
    plazo_maximo_dias INTEGER NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    fecha_reenvio DATE
);

--Sobre alertas
CREATE TABLE alertas (
    id SERIAL PRIMARY KEY,
    proyecto_id INTEGER NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    tipo_alerta tipo_alerta_enum NOT NULL, -- La causa ('retraso_critico', etc.)
    severidad severidad_alerta_enum NOT NULL, -- La severidad ('critico', 'advertencia', etc.)
    mensaje TEXT NOT NULL,
    revisada BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--Profesionales y sus asignaciones
CREATE TABLE profesionales (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    rol VARCHAR(50), -- Por ejemplo: 'Jefe de Proyecto', 'Ingeniero Vial'
    disponibilidad FLOAT DEFAULT 1.0, -- 1.0 para 100% disponible, 0.5 para 50%, etc.
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE asignaciones (
    id SERIAL PRIMARY KEY,
    proyecto_id INT NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    profesional_id INT NOT NULL REFERENCES profesionales(id) ON DELETE CASCADE,
    rol_en_proyecto TEXT,
    UNIQUE(proyecto_id, profesional_id) -- Un profesional no puede estar 2 veces en el mismo proyecto
);