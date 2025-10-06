// backend/src/controllers/proyectoController.ts
import { Request, Response } from 'express';
import { pool } from '../config/database';

export const obtenerProyectos = async (req: Request, res: Response) => {
  try {
    const { tipo, profesional, estado } = req.query;
    
    let query = 'SELECT * FROM proyectos WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (tipo && tipo !== 'todos') {
      query += ` AND tipo = $${paramCount}`;
      params.push(tipo);
      paramCount++;
    }

    if (profesional && profesional !== 'todos') {
      query += ` AND profesional_asignado = $${paramCount}`;
      params.push(profesional);
      paramCount++;
    }

    if (estado) {
      query += ` AND estado = $${paramCount}`;
      params.push(estado);
    }

    query += ' ORDER BY fecha_registro DESC';

    const result = await pool.query(query, params);
    
    // Obtener fases para cada proyecto
    const proyectosConFases = await Promise.all(
      result.rows.map(async (proyecto) => {
        const fasesResult = await pool.query(
          'SELECT * FROM fases WHERE proyecto_codigo = $1 ORDER BY orden',
          [proyecto.codigo]
        );
        
        const obsResult = await pool.query(
          'SELECT * FROM observaciones_seremitt WHERE proyecto_codigo = $1 ORDER BY created_at DESC LIMIT 1',
          [proyecto.codigo]
        );

        return {
          ...proyecto,
          fases: fasesResult.rows,
          observacionesSEREMITT: obsResult.rows[0] || null
        };
      })
    );

    res.json(proyectosConFases);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
};

export const crearProyecto = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      codigo,
      nombre,
      cliente,
      tipo,
      ubicacion,
      fechaCompromiso,
      estimacionDias,
      fases
    } = req.body;

    // Insertar proyecto
    await client.query(
      `INSERT INTO proyectos 
       (codigo, nombre, cliente, tipo, ubicacion, fecha_compromiso, estado, estimacion_dias, estimacion_ajustada)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [codigo, nombre, cliente, tipo, ubicacion, fechaCompromiso, 'En Desarrollo', estimacionDias, estimacionDias]
    );

    // Insertar fases
    for (let i = 0; i < fases.length; i++) {
      await client.query(
        'INSERT INTO fases (proyecto_codigo, nombre, orden) VALUES ($1, $2, $3)',
        [codigo, fases[i], i]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Proyecto creado exitosamente', codigo });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear proyecto:', error);
    res.status(500).json({ error: 'Error al crear proyecto' });
  } finally {
    client.release();
  }
};

export const actualizarEstadoProyecto = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { codigo } = req.params;
    const { estado } = req.body;

    // Obtener proyecto actual
    const proyectoResult = await client.query(
      'SELECT * FROM proyectos WHERE codigo = $1',
      [codigo]
    );

    if (proyectoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    const proyecto = proyectoResult.rows[0];

    // Actualizar estado
    await client.query(
      'UPDATE proyectos SET estado = $1, updated_at = CURRENT_TIMESTAMP WHERE codigo = $2',
      [estado, codigo]
    );

    // Manejar observaciones SEREMITT según el nuevo estado
    if (estado === 'Enviado a SEIM') {
      const plazoEvaluacion = proyecto.tipo === 'Básico' ? 45 : 60;
      const fechaVencimiento = new Date();
      fechaVencimiento.setDate(fechaVencimiento.getDate() + plazoEvaluacion);

      await client.query(
        `INSERT INTO observaciones_seremitt 
         (proyecto_codigo, ciclo, etapa_actual, plazo_maximo, fecha_vencimiento, fecha_envio)
         VALUES ($1, 1, $2, $3, $4, CURRENT_TIMESTAMP)`,
        [codigo, 'Evaluación SEREMITT (Paso 1)', plazoEvaluacion, fechaVencimiento]
      );
    }

    if (estado === 'En Corrección') {
      const plazoCorreccion = proyecto.tipo === 'Básico' ? 20 : 30;
      const fechaVencimiento = new Date();
      fechaVencimiento.setDate(fechaVencimiento.getDate() + plazoCorreccion);

      // Obtener última observación
      const obsResult = await client.query(
        'SELECT ciclo FROM observaciones_seremitt WHERE proyecto_codigo = $1 ORDER BY created_at DESC LIMIT 1',
        [codigo]
      );

      const cicloActual = obsResult.rows[0]?.ciclo || 1;

      await client.query(
        `INSERT INTO observaciones_seremitt 
         (proyecto_codigo, ciclo, etapa_actual, plazo_maximo, fecha_vencimiento, fecha_recepcion_observaciones)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
        [codigo, cicloActual, 'Corrección consultora (Paso 2)', plazoCorreccion, fechaVencimiento]
      );
    }

    await client.query('COMMIT');
    res.json({ message: 'Estado actualizado exitosamente' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  } finally {
    client.release();
  }
};

export const actualizarAvance = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { codigo } = req.params;
    const { fases } = req.body;

    // Actualizar cada fase
    for (const fase of fases) {
      await client.query(
        `UPDATE fases 
         SET completada = $1, 
             fecha_inicio = $2, 
             fecha_fin = $3 
         WHERE proyecto_codigo = $4 AND nombre = $5`,
        [fase.completada, fase.fechaInicio, fase.fechaFin, codigo, fase.nombre]
      );
    }

    // Calcular avance
    const fasesCompletadas = fases.filter((f: any) => f.completada).length;
    const avance = Math.round((fasesCompletadas / fases.length) * 100);

    await client.query(
      'UPDATE proyectos SET avance = $1, updated_at = CURRENT_TIMESTAMP WHERE codigo = $2',
      [avance, codigo]
    );

    await client.query('COMMIT');
    res.json({ message: 'Avance actualizado exitosamente', avance });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al actualizar avance:', error);
    res.status(500).json({ error: 'Error al actualizar avance' });
  } finally {
    client.release();
  }
};