import { Router } from "express"
import { 
  findAll, 
  findOne, 
  add, 
  update, 
  remove, 
  sanitizedTipoDeTorneoInput 
} from "./tipoDeTorneo.controler.js"
import { requireAuth, requireAdmin } from "../shared/middleware/auth.middleware.js"

export const tipoDeTorneoRouter = Router()

// TODAS las rutas requieren ser administrador
tipoDeTorneoRouter.get("/", requireAuth, requireAdmin, findAll)
tipoDeTorneoRouter.get("/:id", requireAuth, requireAdmin, findOne)
tipoDeTorneoRouter.post("/", requireAuth, requireAdmin, sanitizedTipoDeTorneoInput, add)
tipoDeTorneoRouter.put("/:id", requireAuth, requireAdmin, sanitizedTipoDeTorneoInput, update)
tipoDeTorneoRouter.delete("/:id", requireAuth, requireAdmin, remove)


/*
GET    /api/tipoDeTorneo           # Listar tipos (solo admin)
GET    /api/tipoDeTorneo/1         # Ver tipo específico (solo admin)  
POST   /api/tipoDeTorneo           # Crear tipo (solo admin)
PUT    /api/tipoDeTorneo/1         # Actualizar tipo (solo admin)
DELETE /api/tipoDeTorneo/1         # Eliminar tipo (solo admin)
*/