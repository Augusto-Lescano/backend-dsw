import express, { NextFunction, Request, Response } from "express";
import { Torneo } from "./torneo.entity.js";
import { orm } from "../shared/db/orm.js";
import { crearTorneoInscripcion } from "../service/torneoService/crearTorneoInscripcion.js";
import { InscripcionService } from "../service/inscripcionService/inscripcionService.js";

const em = orm.em;
const inscripcionService = new InscripcionService();

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
        region: req.body.region,
        tipoDeTorneo: req.body.tipoDeTorneo,
        juego: req.body.juego,
        plataforma: req.body.plataforma
    }

    // Validar campos requeridos (sin estado y resultado)
    const camposRequeridos = [
        'nombre', 'descripcionReglas', 'cantJugadores', 
        'fechaInicio', 'fechaFin', 'fechaInicioIns', 'fechaFinIns',
        'region', 'tipoDeTorneo', 'juego', 'plataforma'
    ];

    for (const campo of camposRequeridos) {
        if (req.body.sanitizedInput[campo] === undefined || req.body.sanitizedInput[campo] === null) {
            res.status(400).json({ 
                message: `El campo ${campo} es requerido` 
            });
            return;
        }
    }

    // Validar que los IDs sean números válidos
    const camposId = ['tipoDeTorneo', 'juego', 'plataforma'];
    for (const campo of camposId) {
        const id = req.body.sanitizedInput[campo];
        if (isNaN(Number(id))) {
            res.status(400).json({ 
                message: `El campo ${campo} debe ser un ID numérico válido` 
            });
            return;
        }
    }

    Object.keys(req.body.sanitizedInput).forEach(key => {
        if (req.body.sanitizedInput[key] === undefined)
            delete req.body.sanitizedInput[key]
    })
    
    next();
}

async function findAll(req: Request, res: Response) {
    try {
        const torneos = await em.find(
            Torneo,
            {},
            { populate: ["tipoDeTorneo", "juego", "creador", "plataforma", "inscripcion"] }
        )

        // Agregar estado de inscripcion calculado a cada torneo
        const torneosConEstado = torneos.map(torneo => ({
            ...torneo,
            estadoInscripcion: inscripcionService.calcularEstadoInscripcion(
                torneo.fechaInicioIns,
                torneo.fechaFinIns
            )
        }))

        res.status(200).json({ message: 'Torneos encontrados', data: torneosConEstado })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function findOne(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const torneo = await em.findOneOrFail(Torneo, { id }, {
            populate: [
                "tipoDeTorneo",
                "juego",
                "creador",
                "plataforma",
                "inscripcion",
                "inscripcion.inscripcionesIndividuales",
                "inscripcion.inscripcionesIndividuales.usuario",
                "inscripcion.inscripcionesEquipos",
                "inscripcion.inscripcionesEquipos.equipo",
                "inscripcion.inscripcionesEquipos.equipo.capitan",
                "inscripcion.inscripcionesEquipos.equipo.jugadores"
            ]
        })

        // Agregar estado de inscripcion calculado
        const torneoConEstado = {
            ...torneo,
            estadoInscripcion: inscripcionService.calcularEstadoInscripcion(
                torneo.fechaInicioIns,
                torneo.fechaFinIns
            )
        }

        res.status(200).json({ message: 'Torneo encontrado', data: torneoConEstado })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function add(req: Request, res: Response) {
  try {
    // Obtener el ID del usuario autenticado de la sesión
    const usuarioCreadorId = req.session?.usuario?.id;
    
    if (!usuarioCreadorId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const resultado = await crearTorneoInscripcion(req.body.sanitizedInput, usuarioCreadorId.toString());
    res.status(201).json({ message: 'Torneo e inscripcion creados', data: resultado });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const torneoToUpdate = await em.findOneOrFail(Torneo, { id })
        em.assign(torneoToUpdate, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json({ message: 'Torneo actualizado', data: torneoToUpdate })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id)
        const torneo = em.getReference(Torneo, id)
        await em.removeAndFlush(torneo)
        res.status(200).json({ message: "Torneo eliminado" })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export { sanitizeTorneoInput, findAll, findOne, add, update, remove }