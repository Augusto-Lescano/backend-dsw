import { Plataforma } from "./plataforma.entity.js";
import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/orm.js";
import { plataformaRouter } from "./plataforma.routes.js";

function sanitizedPlataformaInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        descripcion:req.body.descripcion
    }

    Object.keys(req.body.sanitizedInput).forEach(key => {
        if(req.body.sanitizedInput[key] === undefined)
        delete req.body.sanitizedInput[key]
    })
    next()
}

const em = orm.em

async function findAll(req:Request, res:Response){
  try {
    const plataformas = await em.find(Plataforma, {})
    res.status(200).json({message:"Lista de plataformas",data:plataformas})
  } catch (error:any) {
    res.status(500).json({message:error.message})
  }
}

async function add(req:Request, res:Response){
 try {
    const plataforma = em.create(Plataforma, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({message:"Plataforma creada",data:plataforma})
  } catch (error:any) {
    res.status(500).json({message:error.message})
  }
}

async function findOne(req:Request, res:Response){
 try {
    const id = Number.parseInt(req.params.id)
    const plataforma = await em.findOneOrFail(Plataforma,{id})
    res.status(200).json({message:"Plataforma encontrada",data:plataforma})
 } catch (error:any) {
    res.status(500).json({message:error.message})
 }
}

async function update(req:Request, res:Response){
  try {
    const id = Number.parseInt(req.params.id)
    const plataformaToUpdate = await em.findOneOrFail(Plataforma, {id})
    em.assign(plataformaToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({message:"Plataforma actualizada", data:plataformaToUpdate})
  } catch (error:any) {
    res.status(500).json({message:error.message})
  }
}

async function remove(req:Request, res:Response){
  try {
    const id = Number.parseInt(req.params.id)
    const plataformaToDelete = em.getReference(Plataforma, id)
    await em.removeAndFlush(plataformaToDelete)
    res.status(200).json({message:"Plataforma eliminada"})
  } catch (error:any) {
    res.status(500).json({message:error.message})
  }
}


export {sanitizedPlataformaInput, findAll, add, findOne, update, remove}