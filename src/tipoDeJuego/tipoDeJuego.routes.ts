import { Router } from "express";
import { 
  sanitizedTipoDeJuegoInput, 
  findAll, 
  findOne, 
  add, 
  update, 
  remove 
} from "./tipoDeJuego.controler.js";
import { requireAuth, requireAdmin } from "../shared/middleware/auth.middleware.js";

export const tipoDeJuegoRouter = Router()

// TODAS las rutas requieren ser administrador
tipoDeJuegoRouter.get("/", requireAuth, requireAdmin, findAll)
tipoDeJuegoRouter.get("/:id", requireAuth, requireAdmin, findOne)
tipoDeJuegoRouter.post("/", requireAuth, requireAdmin, sanitizedTipoDeJuegoInput, add)
tipoDeJuegoRouter.put("/:id", requireAuth, requireAdmin, sanitizedTipoDeJuegoInput, update)
tipoDeJuegoRouter.delete("/:id", requireAuth, requireAdmin, remove)

/*
GET    /api/tipoDeJuego           # Listar tipos de juego (solo admin)
GET    /api/tipoDeJuego/1         # Ver tipo específico (solo admin)  
POST   /api/tipoDeJuego           # Crear tipo (solo admin)
PUT    /api/tipoDeJuego/1         # Actualizar tipo (solo admin)
DELETE /api/tipoDeJuego/1         # Eliminar tipo (solo admin)
*/