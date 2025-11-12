import { Router } from "express";
import { sanitizeTorneoInput,
    findAll,
    findOne,
    add,
    update,
    remove,
} from "./torneo.controller.js";
import { requireAuth, requireAdmin, requireOwnerOrAdmin } from "../shared/middleware/auth.middleware.js";

export const torneoRouter = Router()

// Rutas públicas (acceso sin autenticación)
torneoRouter.get('/', findAll) // Cualquiera puede ver torneos
torneoRouter.get('/:id', findOne) // Cualquiera puede ver un torneo

// Rutas de administración - solo admins
torneoRouter.post('/', requireAuth, requireAdmin, sanitizeTorneoInput, add) // Solo admin puede crear
torneoRouter.put('/:id', requireAuth, requireAdmin, sanitizeTorneoInput, update) // Solo admin puede actualizar
torneoRouter.patch('/:id', requireAuth, requireAdmin, sanitizeTorneoInput, update) // Solo admin puede actualizar
torneoRouter.delete('/:id', requireAuth, requireAdmin, remove) // Solo admin puede eliminar
