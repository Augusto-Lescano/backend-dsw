import { Router } from "express";
import { findAll, findOne, sanitizeUsuarioInput,add, update, remove } from "./usuario.controler.js";

export const usuarioRouter = Router()

usuarioRouter.get('/', findAll)
usuarioRouter.get('/:id', findOne)
usuarioRouter.post('/', sanitizeUsuarioInput,add)
usuarioRouter.put('/:id',sanitizeUsuarioInput, update)
usuarioRouter.patch('/:id',sanitizeUsuarioInput,update)
usuarioRouter.delete('/:id', remove)