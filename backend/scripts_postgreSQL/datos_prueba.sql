
-- 1. Insertar profesionales de prueba
INSERT INTO profesionales (nombre_completo, email, rol, disponibilidad, fecha_creacion) VALUES
('María González', 'maria.gonzalez@imiv.cl', 'Jefe de Proyecto', 1.0, CURRENT_TIMESTAMP),
('Juan Pérez', 'juan.perez@imiv.cl', 'Ingeniero Vial', 0.8, CURRENT_TIMESTAMP),
('Ana Silva', 'ana.silva@imiv.cl', 'Analista de Tránsito', 1.0, CURRENT_TIMESTAMP),
('Carlos Rojas', 'carlos.rojas@imiv.cl', 'Modelador', 0.5, CURRENT_TIMESTAMP);

-- 2. Insertar proyectos de prueba con diferentes estados
INSERT INTO proyectos (
    codigo, nombre, tipo, cliente, ubicacion, estado, 
    fecha_registro, fecha_compromiso, 
    estimacion_inicial_dias, estimacion_ajustada_dias, 
    avance, profesional_lider_id
) VALUES
-- Proyecto en desarrollo
('IMIV-2025-0001', 'Ampliación Avenida Libertad', 'Mayor', 'Municipalidad de Santiago', 
 'Avenida Libertad, entre calle 1 y calle 5', 'En Desarrollo', 
 CURRENT_TIMESTAMP, CURRENT_DATE + INTERVAL '45 days', 
 91, 91, 35.0, 1),

-- Proyecto iniciado
('IMIV-2025-0002', 'Mejoramiento Cruce Escolar', 'Básico', 'MINEDUC Región Metropolitana', 
 'Cruce Av. Principal con Calle Escuela', 'Iniciado', 
 CURRENT_TIMESTAMP, CURRENT_DATE + INTERVAL '30 days', 
 24, 24, 0.0, 2),

-- Proyecto subido a SEIM
('IMIV-2025-0003', 'Rotonda Acceso Norte', 'Intermedio', 'Gobierno Regional', 
 'Intersección Ruta 5 con Camino Provincial', 'Subido a SEIM', 
 CURRENT_TIMESTAMP - INTERVAL '40 days', CURRENT_DATE + INTERVAL '10 days', 
 65, 65, 100.0, 1),

-- Proyecto en corrección
('IMIV-2025-0004', 'Ciclovía Parque Urbano', 'Intermedio', 'Municipalidad de Viña del Mar', 
 'Parque Urbano sector poniente', 'En Corrección', 
 CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_DATE + INTERVAL '15 days', 
 65, 70, 85.0, 3),

-- Proyecto aprobado
('IMIV-2025-0005', 'Semáforos Inteligentes Centro', 'Básico', 'Municipalidad de Valparaíso', 
 'Centro histórico - 5 intersecciones', 'Aprobado', 
 CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_DATE - INTERVAL '5 days', 
 24, 24, 100.0, 2);

-- 3. Insertar fases para el proyecto Mayor (IMIV-2025-0001)
INSERT INTO fases (proyecto_id, nombre, orden, fase_completada, fecha_inicio_real, fecha_fin_real) VALUES
(1, 'Ficha resumen y esquema', 1, true, CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '18 days'),
(1, 'Certificado informaciones previas', 2, true, CURRENT_DATE - INTERVAL '18 days', CURRENT_DATE - INTERVAL '15 days'),
(1, 'Definiciones iniciales del IMIV', 3, true, CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE - INTERVAL '12 days'),
(1, 'Estudios de base situación actual', 4, true, CURRENT_DATE - INTERVAL '12 days', CURRENT_DATE - INTERVAL '8 days'),
(1, 'Situación base (proyección oferta/demanda)', 5, false, CURRENT_DATE - INTERVAL '8 days', NULL),
(1, 'Situación con proyecto', 6, false, NULL, NULL),
(1, 'Cuantificación de impactos', 7, false, NULL, NULL),
(1, 'Desarrollo medidas de mitigación', 8, false, NULL, NULL),
(1, 'Situación con proyecto mejorada', 9, false, NULL, NULL),
(1, 'Modelación de transporte completa', 10, false, NULL, NULL),
(1, 'Conclusiones y anexo digital', 11, false, NULL, NULL),
(1, 'Revisión integral', 12, false, NULL, NULL),
(1, 'Preparación para envío SEIM', 13, false, NULL, NULL);

-- 4. Insertar fases para proyecto Básico (IMIV-2025-0002)
INSERT INTO fases (proyecto_id, nombre, orden, fase_completada) VALUES
(2, 'Ficha resumen y esquema', 1, false),
(2, 'Certificado informaciones previas', 2, false),
(2, 'Área de influencia', 3, false),
(2, 'Caracterización situación actual', 4, false),
(2, 'Medidas de mitigación propuestas', 5, false),
(2, 'Situación con proyecto mejorada', 6, false),
(2, 'Revisión y ajustes finales', 7, false),
(2, 'Preparación para envío SEIM', 8, false);

-- 5. Insertar observaciones SEREMITT para proyecto en corrección
INSERT INTO observaciones_seremitt (
    proyecto_id, ciclo, etapa_actual, 
    fecha_recepcion_observaciones, plazo_maximo_dias, fecha_vencimiento
) VALUES
(4, 1, 'Primera Revisión SEREMITT', 
 CURRENT_DATE - INTERVAL '5 days', 20, CURRENT_DATE + INTERVAL '15 days');

-- 6. Insertar alertas
INSERT INTO alertas (proyecto_id, tipo_alerta, severidad, mensaje, revisada, fecha_creacion) VALUES
(3, 'vencimiento_proximo', 'advertencia', 
 'El proyecto Rotonda Acceso Norte vence en 10 días', false, CURRENT_TIMESTAMP),
(4, 'seremitt_urgente', 'critico', 
 'Observaciones SEREMITT deben responderse en 15 días', false, CURRENT_TIMESTAMP);

-- 7. Insertar asignaciones
INSERT INTO asignaciones (proyecto_id, profesional_id, rol_en_proyecto) VALUES
(1, 1, 'Jefe de Proyecto'),
(1, 2, 'Ingeniero Vial'),
(1, 4, 'Modelador de Tránsito'),
(2, 2, 'Responsable'),
(3, 1, 'Jefe de Proyecto'),
(4, 3, 'Analista Principal'),
(5, 2, 'Ejecutor');

-- Verificar datos insertados
SELECT 'Profesionales insertados:' as info, COUNT(*) as cantidad FROM profesionales
UNION ALL
SELECT 'Proyectos insertados:', COUNT(*) FROM proyectos
UNION ALL
SELECT 'Fases insertadas:', COUNT(*) FROM fases
UNION ALL
SELECT 'Alertas insertadas:', COUNT(*) FROM alertas;