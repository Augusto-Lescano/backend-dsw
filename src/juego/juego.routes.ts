import { Router } from "express";
import { 
  sanitizedJuegoInput, 
  findAll, 
  findOne, 
  add, 
  update, 
  remove,
  obtenerJuegoConTorneos,
  obtenerTorneosActivosPorJuego,
  obtenerTorneosFinalizadosPorJuego
} from "./juego.controller.js";

import { requireAuth, requireAdmin } from "../shared/middleware/auth.middleware.js";

export const juegoRouter = Router()

// TODAS las rutas requieren ser administrador
juegoRouter.get("/", requireAuth, requireAdmin, findAll)
juegoRouter.get("/:id", requireAuth, requireAdmin, findOne)
juegoRouter.post("/", requireAuth, requireAdmin, sanitizedJuegoInput, add)
juegoRouter.put("/:id", requireAuth, requireAdmin, sanitizedJuegoInput, update)
juegoRouter.delete("/:id", requireAuth, requireAdmin, remove)
juegoRouter.get("/:id/torneos", requireAuth, requireAdmin, obtenerJuegoConTorneos) // Juego con todos sus torneos
juegoRouter.get("/:juegoId/torneos/activos", requireAuth, requireAdmin, obtenerTorneosActivosPorJuego) // Solo torneos activos
juegoRouter.get("/:juegoId/torneos/finalizados", requireAuth, requireAdmin, obtenerTorneosFinalizadosPorJuego) // Solo torneos finalizados
