import { Request, Response, NextFunction } from "express";
import { TipoDeJuego } from "./tipoDeJuego.entity.js";
import { orm } from "../shared/db/orm.js";


function sanitizedTipoDeJuegoInput(req:Request,res:Response,next:NextFunction){
  const source=req.body
  req.body.sanitizedInput={
    nombre:source.nombre,
    descripcion:source.descripcion
  }
  Object.keys(req.body.sanitizedInput).forEach(key=>{
    if(req.body.sanitizedInput[key]===undefined){
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

const em = orm.em

async function findAll(req:Request, res:Response){
  try {
    const tiposDeJuego = await em.find(TipoDeJuego,{})
    res.status(200).json({message:"Todos los tipos de juegos", data: tiposDeJuego})
  } catch (error: any) {
    res.status(500).json(error.message)
  }
}

async function findOne(req:Request, res:Response){
  try {
    const id = Number.parseInt(req.params.id)
    const tipoDeJuego = await em.findOneOrFail(TipoDeJuego, {id})
    res.status(200).json({message:"Tipo de juego encontrado", data: tipoDeJuego})
  } catch (error: any) {
    res.status(500).json({message:error.message})
  }
}

async function add(req:Request, res:Response){
  try {
    const tipoDeJuego= em.create(TipoDeJuego, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({message: "Tipo de Juego creado", data: tipoDeJuego})
  } catch (error:any) {
    res.status(500).json({message:error.message})
  }
}

async function update(req:Request, res:Response){
  try {
    const id = Number.parseInt(req.params.id)
    const tipodeJuego = em.getReference(TipoDeJuego,id)
    em.assign(tipodeJuego, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({message:"Tipo de Juego actualizado", data: tipodeJuego})
  } catch (error:any) {
    res.status(500).json({message:error.message})
  }
}

async function remove(req:Request, res:Response){
  try {
    const id = Number.parseInt(req.params.id)
    const tipoDeJuego = em.getReference(TipoDeJuego, id)
    await em.removeAndFlush(tipoDeJuego)
    res.status(200).json({message:"Tipo de juego eliminado"})
  } catch (error:any) {
    res.status(500).json({message:error.message})
  }
  
}

export {sanitizedTipoDeJuegoInput, findAll, findOne, add, update, remove}