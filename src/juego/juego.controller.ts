import { Request, Response, NextFunction } from "express";
import { Juego } from "./juego.entity.js";
import { Torneo } from "../torneo/torneo.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em;

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

// Obtener juego con torneos activos y finalizados
async function obtenerJuegoConTorneos(req:Request, res:Response){
  try {
    const id = Number.parseInt(req.params.id)
    const juego = await em.findOneOrFail(Juego, {id}, {
      populate: [
        'tipoDeJuego', 
        'plataformas',
        'torneos',
        'torneos.plataforma',
        'torneos.creador',
        'torneos.tipoDeTorneo'
      ]
    })
    
    // Obtener fecha actual para comparaciones
    const fechaActual = new Date();
    
    // Filtrar torneos activos (no finalizados y fecha futura)
    const torneosActivos = juego.torneos.getItems().filter(torneo => {
      return torneo.estado !== 'finalizado' && new Date(torneo.fechaFin) > fechaActual;
    });
    
    // Filtrar torneos finalizados (estado finalizado o fecha pasada)
    const torneosFinalizados = juego.torneos.getItems().filter(torneo => {
      return torneo.estado === 'finalizado' || new Date(torneo.fechaFin) <= fechaActual;
    });
    
    res.status(200).json({
      message: "Juego con torneos encontrado",
      data: {
        juego,
        torneosActivos,
        torneosFinalizados
      }
    })
  } catch (error:any) {
    res.status(500).json({message:error.message})
  }
}

// Obtener solo torneos activos de un juego
async function obtenerTorneosActivosPorJuego(req:Request, res:Response){
  try {
    const juegoId = Number.parseInt(req.params.juegoId)
    const fechaActual = new Date();
    
    const torneosActivos = await em.find(Torneo, {
      juego: juegoId,
      estado: { $ne: 'finalizado' },
      fechaFin: { $gt: fechaActual }
    }, {
      populate: ['plataforma', 'creador', 'tipoDeTorneo', 'juego']
    })
    
    res.status(200).json({
      message: "Torneos activos del juego",
      data: torneosActivos
    })
  } catch (error:any) {
    res.status(500).json({message:error.message})
  }
}

// Obtener solo torneos finalizados de un juego
async function obtenerTorneosFinalizadosPorJuego(req:Request, res:Response){
  try {
    const juegoId = Number.parseInt(req.params.juegoId)
    const fechaActual = new Date();
    
    const torneosFinalizados = await em.find(Torneo, {
      juego: juegoId,
      $or: [
        { estado: 'finalizado' },
        { fechaFin: { $lte: fechaActual } }
      ]
    }, {
      populate: ['plataforma', 'creador', 'tipoDeTorneo', 'juego']
    })
    
    res.status(200).json({
      message: "Torneos finalizados del juego",
      data: torneosFinalizados
    })
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
    const juego = await em.findOneOrFail(Juego, id)
    
    console.log('Datos recibidos para actualizar:', req.body.sanitizedInput)
    
    // Asignar los nuevos valores
    em.assign(juego, req.body.sanitizedInput)
    await em.flush()
    
    // Recargar el juego con las relaciones populadas
    const juegoActualizado = await em.findOneOrFail(Juego, id, {
      populate: ['tipoDeJuego', 'plataformas']
    })
    
    console.log('Juego actualizado:', juegoActualizado)
    
    res.status(200).json({
      message: "Juego actualizado",
      data: juegoActualizado
    })
  } catch (error:any) {
    console.error('Error actualizando juego:', error)
    res.status(500).json({message: error.message})
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

export {
  sanitizedJuegoInput, 
  findAll, 
  findOne, 
  obtenerJuegoConTorneos,
  obtenerTorneosActivosPorJuego,
  obtenerTorneosFinalizadosPorJuego,
  add, 
  update, 
  remove
}