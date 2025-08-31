import { Router } from "express"
import { findAll, findOne, add, update, remove, sanitizedTipoDeTorneoInput } from "./tipoDeTorneo.controler.js"

export const tipoDeTorneoRouter=Router()

tipoDeTorneoRouter.get("/",findAll)
tipoDeTorneoRouter.get("/:id",findOne)
tipoDeTorneoRouter.post("/",sanitizedTipoDeTorneoInput, add)
tipoDeTorneoRouter.put("/:id",sanitizedTipoDeTorneoInput, update)
tipoDeTorneoRouter.delete("/:id",remove)