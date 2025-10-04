import { Request, Response, NextFunction } from "express";
import {orm} from "../shared/db/orm.js"
import { Inscripcion } from "./inscripcion.entity.js";


function sanitizedInscripcionInput(req:Request, res:Response, next:NextFunction){
  const source = req.body
  req.body.sanitizedInput = {
    estado: source.estado,
    fecha: source.fecha,
    usuario: source.usuario,
    torneo: source.torneo

  }
  Object.keys(req.body.sanitizedInput).forEach( key =>{
    if(req.body.sanitizedInput[key]===undefined){
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

const em = orm.em

async function findAll(req: Request, res: Response) {

    try{
        const inscrip = await em.find(Inscripcion,{})
        res.status(200).json({message:"Todas las inscripciones", data:inscrip})
    }catch(err:any){
    res.status(500).json({message:err.message})
  }   
}

async function findOne(req:Request, res:Response) {

    try{
        const id = Number.parseInt(req.params.id)
        const inscrip = await em.findOneOrFail(Inscripcion, {id})
        res.status(200).json({message:"Se encontro la inscripcion", data:inscrip})
    } catch (err:any){
      res.status(500).json({message:err.message})
    }
}


async function add(req:Request, res:Response) {

  try{
    const inscrip = em.create( Inscripcion ,req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({message:"Inscripcion creada", data:inscrip})
  }catch(err:any){
    res.status(500).json({message:err.message})
  }
}


async function update(req:Request, res:Response) {

  try{
    const id = Number.parseInt(req.params.id)
    const inscrip = await em.getReference(Inscripcion,id)
    em.assign(inscrip,req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({message:"Inscripcion actualizada", data:inscrip})
  }catch(err:any){
    res.status(500).json({message:err.message})
  }
}


async function remove(req:Request, res:Response){

  try{
    const id = Number.parseInt(req.params.id)
    const inscrip = await em.getReference(Inscripcion, id)
    await em.removeAndFlush(inscrip)
    res.status(200).json({message:"Inscripcion eliminada", data:inscrip})
  }catch(err:any){
    res.status(500).json({message:err.message})
  }
}


export {sanitizedInscripcionInput , findAll, findOne, add, update, remove}