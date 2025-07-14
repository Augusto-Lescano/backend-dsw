import { Request, Response, NextFunction } from "express";
import { TipoDeTorneoRepository } from "./tipoDeTorneo.repository.js";
import { TipoDeTorneo } from "./tipoDeTorneo.entity.js";

const repository = new TipoDeTorneoRepository()

function sanitizedTipoDeTorneoInput(req:Request, res:Response, next:NextFunction){
  const source = req.body
  req.body.sanitizedTipoDeTorneo = {
    nombre: source.nombre,
    descripcion: source.descripcion
  }
  Object.keys(req.body.sanitizedTipoDeTorneo).forEach( key =>{
    if(req.body.sanitizedTipoDeTorneo[key]===undefined){
      delete req.body.sanitizedTipoDeTorneo[key]
    }
  })
  next()
}

function findAll(req:Request, res:Response){
  res.json({data:repository.findAll()})
}

function findOne(req:Request, res:Response){
  const tipoDeTorneo = repository.findOne({id: req.params.id})
  if(tipoDeTorneo===undefined){
    res.status(404).send({message:"Tipo de Torneo not found"})
  }else{
    res.status(200).send({data: tipoDeTorneo})
  }
}

function add(req:Request, res:Response){
  const tipoDeTorneo = new TipoDeTorneo(
    req.body.sanitizedTipoDeTorneo.nombre,
    req.body.sanitizedTipoDeTorneo.descripcion
  )
  repository.add(tipoDeTorneo)
  res.status(201).send({message:"Tipo de Torneo created", data: tipoDeTorneo})
}

function update(req:Request, res:Response){
  req.body.sanitizedTipoDeTorneo.id=req.params.id
  const tipoDeTorneo = repository.update(req.body.sanitizedTipoDeTorneo)
  if(tipoDeTorneo===undefined){
    res.status(404).send({message:"Tipo de Torneo not found"})
  }else{
    res.status(200).send({message:"Tipo de Toreno updated", data:tipoDeTorneo})
  }
}

function remove(req:Request, res:Response){
    const tipoDeTorneo = repository.delete({id: req.params.id})
  if(tipoDeTorneo===undefined){
    res.status(404).send({message:"Tipo de Torneo not found"})
  }else{
    res.status(200).send({message:"Tipo de Toreno deleted"})
  }
}

export {sanitizedTipoDeTorneoInput, findAll, findOne, add, update, remove}