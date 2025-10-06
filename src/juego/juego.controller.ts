import { Request, Response, NextFunction } from "express";
import { Juego } from "./juego.entity.js";
import { orm } from "../shared/db/orm.js";

function sanitizedJuegoInput(req:Request, res:Response, next:NextFunction){
  req.body.sanitizedInput={
    nombre:req.body.nombre,
    descripcion:req.body.descripcion,
    tipoDeJuego:req.body.tipoDeJuego,
    plataformas:req.body.plataformas
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
    const juegos = await em.find(Juego,{},{populate:["tipoDeJuego", "plataformas"]})
    res.status(200).json({message:"Listado de Juegos", data: juegos})
  } catch (error:any) {
    res.status(500).json({message:error.message})
  }
}

async function findOne(req:Request, res:Response){
  try {
    const id = Number.parseInt(req.params.id)
    const juego =await em.findOneOrFail(Juego, {id}, {populate:["tipoDeJuego", "plataformas"]})
    res.status(200).json({message:"Juego encontrado", data:juego})
  } catch (error:any) {
    res.status(500).json({message:error.message})
  }
}

async function add(req:Request, res:Response){
  try {
    const juego = em.create(Juego, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({message:"Juego agregado", data:juego})
  } catch (error:any) {
    res.status(500).json({message:error.message})
  }
}

async function update(req:Request, res:Response){
  try {
    const id = Number.parseInt(req.params.id)
    const juego = em.getReference(Juego,id)
    em.assign(juego, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({message:"Juego actualizado"})
  } catch (error:any) {
    res.status(500).json({message:error.message})
  }
}

async function remove(req:Request, res:Response){
  try {
    const id = Number.parseInt(req.params.id)
    const juego = em.getReference(Juego,id)
    await em.removeAndFlush(juego)
    res.status(200).json({message:"Juego borrado"})
  } catch (error:any) {
    res.status(500).json({message:error.message})
  }
}

export {sanitizedJuegoInput, findAll, findOne, add, update, remove}