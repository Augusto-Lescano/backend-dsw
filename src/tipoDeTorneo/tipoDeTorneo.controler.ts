import { Request, Response, NextFunction } from "express";
import {orm} from "../shared/db/orm.js"
import { TipoDeTorneo } from "./tipoDeTorneo.entity.js";

function sanitizedTipoDeTorneoInput(req:Request, res:Response, next:NextFunction){
  const source = req.body
  req.body.sanitizedInput = {
    nombre: source.nombre,
    descripcion: source.descripcion
  }
  Object.keys(req.body.sanitizedInput).forEach( key =>{
    if(req.body.sanitizedInput[key]===undefined){
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

const em = orm.em

async function findAll(req:Request, res:Response){
  try{
    const tiposDeTorneo = await em.find(TipoDeTorneo,{})
    res.status(200).json({message:"Todos los tipos de torneo", data:tiposDeTorneo})
  }catch(err:any){
    res.status(500).json({message:err.message})
  }
    

}

async function findOne(req:Request, res:Response){
  try {
    const id = Number.parseInt(req.params.id)
    const tipoDeTorneo=await em.findOneOrFail(TipoDeTorneo,{id})
    res.status(200).json({message:"Se encontro el tipo de torneo", data:tipoDeTorneo})
  } catch (err:any) {
    res.status(500).json({mesage:err.message})
  }
  
}

async function add(req:Request, res:Response){
  try {
    const tipoDeTorneo = em.create(TipoDeTorneo,req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({message:"Tipo de Torneo creado", data:tipoDeTorneo})
  } catch (err:any) {
    res.status(500).json({message:err.message})
  }
}

async function update(req:Request, res:Response){
  try {
    const id = Number.parseInt(req.params.id)
    const tipoDeTorneo = em.getReference(TipoDeTorneo, id)
    em.assign(tipoDeTorneo, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({message:"Tipo de torneo actualizado", data:tipoDeTorneo})
  } catch (err:any) {
    res.status(500).json({message:err.message})
  }
}

async function remove(req:Request, res:Response){
  try {
    const id = Number.parseInt(req.params.id)
    const tipoDeTorneo  = em.getReference(TipoDeTorneo, id)
    await em.removeAndFlush(tipoDeTorneo)
    res.status(200).json({message:"Tipo de torneo borrado"})
  } catch (err: any) {
    res.status(500).json({message:err.message})
  }
}

export {sanitizedTipoDeTorneoInput , findAll, findOne, add, update, remove}