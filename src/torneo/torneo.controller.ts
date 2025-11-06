import express,{ NextFunction, Request, Response } from "express";
import { Torneo } from "./torneo.entity.js";
import { orm } from "../shared/db/orm.js";
import { crearTorneoInscripcion } from "../service/torneoService/crearTorneo.js";
//import { inscribirEquipoEnTorneo } from "../service/torneoService/inscribirEquipo.js";
import { inscribirEnTorneo } from "../service/torneoService/inscribirEnTorneo.js";

const em = orm.em

function sanitizeTorneoInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        descripcionReglas: req.body.descripcionReglas,
        cantJugadoresEquipo: req.body.cantJugadoresEquipo,
        cantEquipos: req.body.cantEquipos,
        cantJugadores: req.body.cantJugadores,
        fechaInicio: req.body.fechaInicio,
        fechaFin: req.body.fechaFin,
        fechaInicioIns: req.body.fechaInicioIns,
        fechaFinIns: req.body.fechaFinIns,
        resultado: req.body.resultado,
        region: req.body.region,
        estado: req.body.estado,
        tipoDeTorneo: req.body.tipoDeTorneo,
        juego:req.body.juego,
        creador:req.body.creador,
        plataforma:req.body.plataforma
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
      {populate:["tipoDeTorneo","juego","creador","plataforma","inscripcion"]}
      
    )
    res.status(200).json({ message: 'Torneos encontrados', data: torneos})
  } catch (error: any) {
    res.status(500).json ({ message: error.message })
  }
}

async function findOne(req: Request, res: Response){
    try {
    const id = Number.parseInt(req.params.id)
    const torneo = await em.findOneOrFail(Torneo, { id }, {populate:["tipoDeTorneo","juego","creador","plataforma","inscripcion","inscripcion.equipos","inscripcion.equipos.jugadores","inscripcion.equipos.capitan"]})
    res.status(200).json({ message: 'Torneo encontrado', data: torneo})
  } catch (error: any) {
    res.status(500).json ({ message: error.message })
  }
}

async function add(req: Request, res: Response){
    try {
    const resultado  = await crearTorneoInscripcion(req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'Torneo e inscripcion creados', data: resultado })
  } catch (error: any) {
    res.status(400).json ({ message: error.message })
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

const inscribir = async(req: Request, res: Response): Promise<void> => {

  try {
    const torneoId = Number.parseInt(req.params.torneoId);
    const { usuarioId, equipoId } = req.body;

    if (usuarioId && equipoId) {
      res.status(400).json({ message: 'Solo se puede enviar usuarioId (individual) o equipoId (por equipos), no ambos' });
      return;
    }

    if (!usuarioId && !equipoId){
      res.status(400).json({message: 'Se requiere usuarioId para torneos individuales o equipoId para torneos por equipos'});
      return;
    }

    const inscripcionData = { usuarioId, equipoId };
    const resultado = await inscribirEnTorneo(torneoId, inscripcionData);

    res.status(200).json({message:resultado.message,data: resultado});
    }catch (error : any){
      res.status(400).json({message:error.message});
  }
  
}
    

export {sanitizeTorneoInput, findAll, findOne, add, update, remove,inscribir}