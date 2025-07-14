import { Router } from "express"
import { sanitizedTipoDeTorneoInput, findAll, findOne, add, update, remove } from "./tipoDeTorneo.controler.js"
import { sanitizeTorneoInput } from "../torneo/torneo.controller.js"

export const tipoDeTorneoRouter=Router()

tipoDeTorneoRouter.get("/",findAll)
tipoDeTorneoRouter.get("/:id",findOne)
tipoDeTorneoRouter.post("/",sanitizedTipoDeTorneoInput,add)
tipoDeTorneoRouter.put("/:id",sanitizedTipoDeTorneoInput,update)
tipoDeTorneoRouter.patch("/:id",sanitizedTipoDeTorneoInput,update)
tipoDeTorneoRouter.delete("/:id",remove)