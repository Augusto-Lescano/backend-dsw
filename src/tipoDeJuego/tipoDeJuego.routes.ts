import { Router } from "express";
import { sanitizedTipoDeJuegoInput, findAll, findOne, add, update, remove } from "./tipoDeJuego.controler.js";

export const tipoDeJuegoRouter = Router()

tipoDeJuegoRouter.get("/", findAll)
tipoDeJuegoRouter.get("/:id", findOne)
tipoDeJuegoRouter.put("/", sanitizedTipoDeJuegoInput, add)
tipoDeJuegoRouter.post("/:id", sanitizedTipoDeJuegoInput, update)
tipoDeJuegoRouter.patch("/:id", sanitizedTipoDeJuegoInput, update)
tipoDeJuegoRouter.delete("/:id",remove)