// backend/src/config/database.ts

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Inicializar las tablas
export const initDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS proyectos (
        codigo VARCHAR(50) PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        cliente VARCHAR(255) NOT NULL,
        tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('Básico', 'Intermedio', 'Mayor')),
        ubicacion VARCHAR(255) NOT NULL,
        fecha_compromiso TIMESTAMP NOT NULL,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        estado VARCHAR(50) NOT NULL,
        estimacion_dias INTEGER NOT NULL,
        estimacion_ajustada INTEGER NOT NULL,
        avance INTEGER DEFAULT 0,
        profesional_asignado VARCHAR(50),
        ciclo_seremitt INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS fases (
        id SERIAL PRIMARY KEY,
        proyecto_codigo VARCHAR(50) REFERENCES proyectos(codigo) ON DELETE CASCADE,
        nombre VARCHAR(255) NOT NULL,
        completada BOOLEAN DEFAULT FALSE,
        fecha_inicio TIMESTAMP,
        fecha_fin TIMESTAMP,
        orden INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS observaciones_seremitt (
        id SERIAL PRIMARY KEY,
        proyecto_codigo VARCHAR(50) REFERENCES proyectos(codigo) ON DELETE CASCADE,
        ciclo INTEGER NOT NULL,
        etapa_actual VARCHAR(255) NOT NULL,
        plazo_maximo INTEGER NOT NULL,
        fecha_vencimiento TIMESTAMP NOT NULL,
        fecha_envio TIMESTAMP,
        fecha_recepcion_observaciones TIMESTAMP,
        fecha_reenvio TIMESTAMP,
        observaciones TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS alertas (
        id SERIAL PRIMARY KEY,
        proyecto_codigo VARCHAR(50) REFERENCES proyectos(codigo) ON DELETE CASCADE,
        tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('critico', 'advertencia', 'info')),
        mensaje TEXT NOT NULL,
        revisada BOOLEAN DEFAULT FALSE,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_proyectos_estado ON proyectos(estado);
      CREATE INDEX IF NOT EXISTS idx_proyectos_tipo ON proyectos(tipo);
      CREATE INDEX IF NOT EXISTS idx_fases_proyecto ON fases(proyecto_codigo);
      CREATE INDEX IF NOT EXISTS idx_alertas_proyecto ON alertas(proyecto_codigo);
      CREATE INDEX IF NOT EXISTS idx_alertas_revisada ON alertas(revisada);
    `);
    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error);
    throw error;
  } finally {
    client.release();
  }
};