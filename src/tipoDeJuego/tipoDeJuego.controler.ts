import { Request, Response, NextFunction } from "express";
import { TipoDeJuego } from "./tipoDeJuego.entity.js";
import { TipoDeJuegoRepository } from "./tipoDeJuego.repository.js";

function sanitizedTipoDeJuegoInput(req:Request,res:Response,next:NextFunction){
  const source=req.body
  req.body.sanitizedTipoDeJuego={
    nombre:source.nombre,
    descripcion:source.descripcion
  }
  Object.keys(req.body.sanitizedTipoDeJuego).forEach(key=>{
    if(req.body.sanitizedTipoDeJuego[key]===undefined){
      delete req.body.sanitizedTipoDeJuego[key]
    }
  })
  next()
}

const repository = new TipoDeJuegoRepository()

function findAll(req:Request, res:Response){
  res.json({data:repository.findAll()})
}

function findOne(req:Request, res:Response){
  const tipo = repository.findOne({id:req.params.id})
  if(tipo===undefined){
    res.status(404).send({message:"Tipo de Juego not found"})
  }else{
    res.status(200).send({message:"Tipo de Juego found", data:tipo})
  }
}

function add(req:Request, res:Response){
  const input = req.body.sanitizedTipoDeJuego
  const tipo = new TipoDeJuego(
    input.nombre,
    input.descripcion
  )
  repository.add(tipo)
  res.status(201).send({message:"Tipo de Juego created", data:tipo})
}

function update(req:Request, res:Response){
  req.body.sanitizedTipoDeJuego.id=req.params.id
  const tipo = repository.update(req.body.sanitizedTipoDeJuego)
  if(tipo!==undefined){
    res.status(200).send({message:"Tipo de Juego updated", data:tipo})
  }else{
    res.status(404).send({message:"Tipo de Juego not found"})
  }
}

function remove(req:Request, res:Response){
  
  const tipo = repository.delete({id:req.params.id})
  if(tipo!==undefined){
    res.status(200).send({message:"Tipo de Juego deleted", data:tipo})
  }else{
    res.status(404).send({message:"Tipo de Juego not found"})
  }
}

export {sanitizedTipoDeJuegoInput, findAll, findOne, add, update, remove}