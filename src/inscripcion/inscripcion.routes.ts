import { Router } from "express"
import { sanitizedInscripcionInput, findAll, findOne, add, update, remove} from "./inscripcion.controler.js"

export const inscripcionRouter = Router()

inscripcionRouter.get("/",findAll)
inscripcionRouter.get("/:id", findOne)
inscripcionRouter.post("/",sanitizedInscripcionInput,add)
inscripcionRouter.put("/:id",sanitizedInscripcionInput,update)
inscripcionRouter.delete("/:id",remove)