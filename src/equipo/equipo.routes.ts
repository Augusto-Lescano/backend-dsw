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

// SOLO ADMINS pueden ver todos los equipos
equipoRouter.get('/', requireAuth, requireAdmin, findAll)

// SOLO ADMINS pueden ver equipo específico
equipoRouter.get('/:id', requireAuth, requireAdmin, findOne)

// Dueño del equipo O admin pueden actualizar equipos
equipoRouter.put('/:id', requireAuth, requireOwnerOrAdmin, sanitizeEquipoInput, update)
equipoRouter.patch('/:id', requireAuth, requireOwnerOrAdmin, sanitizeEquipoInput, update)

// SOLO ADMINS pueden eliminar equipos
equipoRouter.delete('/:id', requireAuth, requireAdmin, remove)