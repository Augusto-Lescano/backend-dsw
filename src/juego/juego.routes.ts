import { Router } from "express";
import { 
  sanitizedJuegoInput, 
  findAll, 
  findOne, 
  add, 
  update, 
  remove
} from "./juego.controller.js";
import { requireAuth, requireAdmin } from "../shared/middleware/auth.middleware.js";

export const juegoRouter = Router()

// TODAS las rutas requieren ser administrador
juegoRouter.get("/", requireAuth, requireAdmin, findAll)
juegoRouter.get("/:id", requireAuth, requireAdmin, findOne)
juegoRouter.post("/", requireAuth, requireAdmin, sanitizedJuegoInput, add)
juegoRouter.put("/:id", requireAuth, requireAdmin, sanitizedJuegoInput, update)
juegoRouter.delete("/:id", requireAuth, requireAdmin, remove)

/*
GET    /api/juego           # Listar juegos (solo admin)
GET    /api/juego/1         # Ver juego específico (solo admin)  
POST   /api/juego           # Crear juego (solo admin)
PUT    /api/juego/1         # Actualizar juego (solo admin)
DELETE /api/juego/1         # Eliminar juego (solo admin)
*/