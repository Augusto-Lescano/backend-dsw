import { Router } from "express";
import { 
  sanitizedPlataformaInput, 
  findAll, 
  add, 
  findOne, 
  update, 
  remove
} from "./plataforma.controller.js";
import { requireAuth, requireAdmin } from "../shared/middleware/auth.middleware.js";

export const plataformaRouter = Router()

// TODAS las rutas requieren ser administrador
plataformaRouter.get("/", requireAuth, requireAdmin, findAll)
plataformaRouter.post("/", requireAuth, requireAdmin, sanitizedPlataformaInput, add)
plataformaRouter.get("/:id", requireAuth, requireAdmin, findOne)
plataformaRouter.put("/:id", requireAuth, requireAdmin, sanitizedPlataformaInput, update)
plataformaRouter.delete("/:id", requireAuth, requireAdmin, remove)

/*
GET    /api/plataforma           # Listar plataformas (solo admin)
GET    /api/plataforma/1         # Ver plataforma específica (solo admin)  
POST   /api/plataforma           # Crear plataforma (solo admin)
PUT    /api/plataforma/1         # Actualizar plataforma (solo admin)
DELETE /api/plataforma/1         # Eliminar plataforma (solo admin)
*/