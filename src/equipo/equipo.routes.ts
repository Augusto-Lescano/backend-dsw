import { Router } from "express";
import { 
  sanitizeEquipoInput, 
  findAll, 
  findOne, 
  add, 
  update, 
  remove
} from "./equipo.controller.js";
import { requireAuth, requireAdmin, requireOwnerOrAdmin } from "../shared/middleware/auth.middleware.js";

export const equipoRouter = Router()

// Usuarios logueados PUEDEN crear equipos
equipoRouter.post('/', requireAuth, sanitizeEquipoInput, add)
equipoRouter.get('/', requireAuth, findAll)
equipoRouter.get('/:id', requireAuth, findOne)
// Dueño del equipo O admin pueden actualizar equipos
equipoRouter.put('/:id', requireAuth, requireOwnerOrAdmin, sanitizeEquipoInput, update)
equipoRouter.patch('/:id', requireAuth, requireOwnerOrAdmin, sanitizeEquipoInput, update)
equipoRouter.delete('/:id', requireAuth, remove)