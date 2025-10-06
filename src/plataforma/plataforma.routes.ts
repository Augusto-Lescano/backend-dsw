import { Router } from "express";
import { sanitizedPlataformaInput, findAll, add, findOne, update, remove} from "./plataforma.controller.js";

export const plataformaRouter=Router()

plataformaRouter.get("/",findAll)
plataformaRouter.post("/",sanitizedPlataformaInput, add)
plataformaRouter.get("/:id",findOne)
plataformaRouter.put("/:id", sanitizedPlataformaInput, update)
plataformaRouter.delete("/:id",remove)