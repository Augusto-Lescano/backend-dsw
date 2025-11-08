import { Router } from "express"
import { 
  sanitizedInscripcionInput, 
  findAll, 
  findOne, 
  add, 
  update, 
  remove
} from "./inscripcion.controler.js"
import { requireAuth, requireAdmin } from "../shared/middleware/auth.middleware.js"

export const inscripcionRouter = Router()

// TODAS las rutas requieren ser administrador
inscripcionRouter.get("/", requireAuth, requireAdmin, findAll)
inscripcionRouter.get("/:id", requireAuth, requireAdmin, findOne)
inscripcionRouter.post("/", requireAuth, requireAdmin, sanitizedInscripcionInput, add)
inscripcionRouter.put("/:id", requireAuth, requireAdmin, sanitizedInscripcionInput, update)
inscripcionRouter.delete("/:id", requireAuth, requireAdmin, remove)