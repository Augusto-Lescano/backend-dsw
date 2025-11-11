// inscripcion.routes.ts
import { Router } from 'express';
import { 
  inscribirUsuarioIndividual,
  inscribirEquipo,
  obtenerEquiposDelUsuarioAutenticado,
  verificarInscripcion,
  findAll,
  findOne,
  add,
  update,
  remove,
  sanitizedInscripcionInput
} from './inscripcion.controller.js';
import { requireAuth, requireAdmin } from '../shared/middleware/auth.middleware.js';

export const inscripcionRouter = Router();

// Rutas que requieren autenticación
inscripcionRouter.post('/individual', requireAuth, inscribirUsuarioIndividual);
inscripcionRouter.post('/equipo', requireAuth, inscribirEquipo);
inscripcionRouter.get('/mis-equipos', requireAuth, obtenerEquiposDelUsuarioAutenticado);
inscripcionRouter.get('/verificar/:torneoId/usuario/:usuarioId', requireAuth, verificarInscripcion);

// Rutas solo para admin
inscripcionRouter.get('/', requireAdmin, findAll);
inscripcionRouter.get('/:id', requireAdmin, findOne);
inscripcionRouter.post('/', requireAdmin, sanitizedInscripcionInput, add);
inscripcionRouter.put('/:id', requireAdmin, sanitizedInscripcionInput, update);
inscripcionRouter.patch('/:id', requireAdmin, sanitizedInscripcionInput, update);
inscripcionRouter.delete('/:id', requireAdmin, remove);