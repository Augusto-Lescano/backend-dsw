import { Router } from "express";
import { sanitizedJuegoInput, findAll, findOne, add, update, remove} from "./juego.controller.js";

export const juegoRouter=Router()

juegoRouter.get("/",findAll)
juegoRouter.get("/:id", findOne)
juegoRouter.post("/",sanitizedJuegoInput,add)
juegoRouter.put("/:id",sanitizedJuegoInput,update)
juegoRouter.delete("/:id",remove)
