import express,{ NextFunction, Request, Response } from "express";
import { Torneo } from "./torneo.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em

function sanitizeTorneoInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        descripcionReglas: req.body.descripcionReglas,
        cantidadJugadores: req.body.cantidadJugadores,
        fechaInicio: req.body.fechaInicio,
        fechaFin: req.body.fechaFin,
        fechaInicioIns: req.body.fechaInicioIns,
        fechaFinIns: req.body.fechaFinIns,
        resultado: req.body.resultado,
        region: req.body.region,
        estado: req.body.estado,
        tipoDeTorneo: req.body.tipoDeTorneo,
        juego:req.body.juego,
        creador:req.body.creador
    }
    //Más validaciones acá

    Object.keys(req.body.sanitizedInput).forEach(key => {
        if(req.body.sanitizedInput[key] === undefined)
        delete req.body.sanitizedInput[key]
    })
    next()
}

async function findAll(req: Request, res: Response){
    try {
    const torneos = await em.find(
      Torneo,
      {},
      {populate:["tipoDeTorneo","juego","creador"]}
    )
    res.status(200).json({ message: 'Torneos encontrados', data: torneos})
  } catch (error: any) {
    res.status(500).json ({ message: error.message })
  }
}

async function findOne(req: Request, res: Response){
    try {
    const id = Number.parseInt(req.params.id)
    const torneo = await em.findOneOrFail(Torneo, { id }, {populate:["tipoDeTorneo","juego","creador"]})
    res.status(200).json({ message: 'Torneo encontrado', data: torneo})
  } catch (error: any) {
    res.status(500).json ({ message: error.message })
  }
}

async function add(req: Request, res: Response){
    try {
    const torneo = em.create(Torneo, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'Torneo creado', data: torneo})
  } catch (error: any) {
    res.status(500).json ({ message: error.message })
  }   
}

async function update(req: Request, res: Response){
    try {
    const id = Number.parseInt(req.params.id)
    const torneoToUpdate = await em.findOneOrFail(Torneo, { id })
    em.assign(torneoToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'Torneo actualizado', data: torneoToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response){
    try {
    const id = Number.parseInt(req.params.id)
    const torneo = em.getReference(Torneo, id)
    await em.removeAndFlush(torneo)
    res.status(200).json({message:"Torneo eliminado"})
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
    

export {sanitizeTorneoInput, findAll, findOne, add, update, remove}