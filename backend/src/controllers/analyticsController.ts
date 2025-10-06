import { Request, Response } from 'express';
import { pool } from '../config/database';

export const obtenerEstadisticas = async (req: Request, res: Response) => {
  try {
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN estado = 'En Desarrollo' THEN 1 END) as en_desarrollo,
        COUNT(CASE WHEN estado = 'Aprobado' THEN 1 END) as aprobados,
        AVG(avance) as avance_promedio,
        COUNT(CASE WHEN tipo = 'Básico' THEN 1 END) as basico,
        COUNT(CASE WHEN tipo = 'Intermedio' THEN 1 END) as intermedio,
        COUNT(CASE WHEN tipo = 'Mayor' THEN 1 END) as mayor
      FROM proyectos
    `);

    const estadoResult = await pool.query(`
      SELECT estado, COUNT(*) as cantidad
      FROM proyectos
      GROUP BY estado
      ORDER BY cantidad DESC
    `);

    const profesionalResult = await pool.query(`
      SELECT 
        profesional_asignado as profesional,
        COUNT(*) as proyectos,
        COUNT(CASE WHEN estado = 'Aprobado' THEN 1 END) as aprobados,
        AVG(avance) as promedio_avance
      FROM proyectos
      WHERE profesional_asignado IS NOT NULL
      GROUP BY profesional_asignado
      ORDER BY proyectos DESC
    `);

    const timelineResult = await pool.query(`
      SELECT 
        TO_CHAR(fecha_registro, 'Mon') as mes,
        tipo,
        COUNT(*) as cantidad
      FROM proyectos
      WHERE fecha_registro >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY TO_CHAR(fecha_registro, 'Mon'), fecha_registro, tipo
      ORDER BY fecha_registro
    `);

    res.json({
      stats: statsResult.rows[0],
      porEstado: estadoResult.rows,
      porProfesional: profesionalResult.rows,
      timeline: timelineResult.rows
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};