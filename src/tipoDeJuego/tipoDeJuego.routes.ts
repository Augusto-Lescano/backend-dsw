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
