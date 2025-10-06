import { Router } from 'express';
import {
  obtenerProyectos,
  crearProyecto,
  actualizarEstadoProyecto,
  actualizarAvance
} from '../controllers/proyectoController';

const router = Router();

router.get('/', obtenerProyectos);
router.post('/', crearProyecto);
router.patch('/:codigo/estado', actualizarEstadoProyecto);
router.patch('/:codigo/avance', actualizarAvance);

export default router;