import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Inscripcion } from "./inscripcion.entity.js";
import { InscripcionIndividual } from "./inscripcionIndividual.entity.js";
import { InscripcionEquipo } from "./inscripcionEquipo.entity.js";
import { Equipo } from "../equipo/equipo.entity.js";
import { Torneo } from "../torneo/torneo.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";

const em = orm.em;

// Inscribir usuario individual
export async function inscribirUsuarioIndividual(req: Request, res: Response) {
  try {
    const { torneoId } = req.body;
    const usuarioId = req.session?.usuario?.id;

    if (!usuarioId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
    }

    // Verificar que el torneo existe y está abierto para inscripciones
    const torneo = await em.findOneOrFail(Torneo, torneoId, {
      populate: ['inscripcion', 'tipoDeTorneo']
    });

    // Verificar que es torneo individual
    if (!torneo.tipoDeTorneo.esIndividual) {
      res.status(400).json({ message: "Este torneo no es individual" });
    }

    // Verificar fechas de inscripción
    const ahora = new Date();
    if (ahora < torneo.fechaInicioIns || ahora > torneo.fechaFinIns) {
      res.status(400).json({ message: "Fuera del período de inscripción" });
    }

    // Verificar que el usuario existe
    const usuario = await em.findOneOrFail(Usuario, usuarioId);

    // Verificar si ya está inscrito
    const inscripcionExistente = await em.findOne(InscripcionIndividual, {
      usuario: usuarioId,
      inscripcion: torneo.inscripcion.id
    });

    if (inscripcionExistente) {
      res.status(400).json({ message: "Ya estás inscrito en este torneo" });
    }

    // Crear inscripción individual
    const inscripcionIndividual = em.create(InscripcionIndividual, {
      usuario,
      inscripcion: torneo.inscripcion,
      fechaInscripcion: new Date()
    });

    await em.flush();

    res.status(201).json({
      message: "Inscripción individual realizada con éxito",
      data: inscripcionIndividual
    });

  } catch (error: any) {
    console.error('Error en inscribirUsuarioIndividual:', error);
    res.status(500).json({ message: error.message });
  }
}

// Inscribir equipo
export async function inscribirEquipo(req: Request, res: Response) {
  try {
    const { torneoId, equipoId } = req.body;

    // Verificar que el torneo existe
    const torneo = await em.findOneOrFail(Torneo, torneoId, {
      populate: ['inscripcion', 'tipoDeTorneo']
    });

    // Verificar que es torneo por equipos
    if (torneo.tipoDeTorneo.esIndividual) {
      res.status(400).json({ message: "Este torneo es individual, no por equipos" });
    }

    // Verificar fechas de inscripción
    const ahora = new Date();
    if (ahora < torneo.fechaInicioIns || ahora > torneo.fechaFinIns) {
      res.status(400).json({ message: "Fuera del período de inscripción" });
    }

    // Verificar que el equipo existe
    const equipo = await em.findOneOrFail(Equipo, equipoId, {
      populate: ['capitan']
    });

    // Verificar si el equipo ya está inscrito (usando InscripcionEquipo)
    const inscripcionExistente = await em.findOne(InscripcionEquipo, {
      equipo: equipoId,
      inscripcion: torneo.inscripcion.id
    });

    if (inscripcionExistente) {
      res.status(400).json({ message: "El equipo ya está inscrito en este torneo" });
    }

    // Crear inscripción de equipo
    const inscripcionEquipo = em.create(InscripcionEquipo, {
      equipo,
      inscripcion: torneo.inscripcion,
      fechaInscripcion: new Date()
    });

    await em.flush();

    res.status(201).json({
      message: "Equipo inscrito con éxito",
      data: inscripcionEquipo
    });

  } catch (error: any) {
    console.error('Error en inscribirEquipo:', error);
    res.status(500).json({ message: error.message });
  }
}


// Obtener equipos de un usuario específico (para admins)
export async function obtenerEquiposDelUsuarioAutenticado(req: Request, res: Response) {
  try {
    // Obtener el ID del usuario autenticado de la sesión
    const usuarioId = req.session?.usuario?.id;
    
    if (!usuarioId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const equipos = await em.find(Equipo, {
      $or: [
        { capitan: usuarioId },
        { jugadores: usuarioId }
      ]
    }, {
      populate: ['capitan', 'jugadores']
    });

    res.status(200).json({
      message: "Equipos del usuario",
      data: equipos
    });

  } catch (error: any) {
    console.error('Error en obtenerEquiposDelUsuarioAutenticado:', error);
    res.status(500).json({ message: error.message });
  }
}

// Verificar inscripción - CORREGIDO
export async function verificarInscripcion(req: Request, res: Response) {
  try {
    const torneoId = parseInt(req.params.torneoId);
    const usuarioId = parseInt(req.params.usuarioId);

    const torneo = await em.findOneOrFail(Torneo, torneoId, {
      populate: ['inscripcion', 'tipoDeTorneo']
    });

    let estaInscrito = false;

    if (torneo.tipoDeTorneo.esIndividual) {
      // Verificar inscripción individual
      const inscripcion = await em.findOne(InscripcionIndividual, {
        usuario: usuarioId,
        inscripcion: torneo.inscripcion.id
      });
      estaInscrito = !!inscripcion;
    } else {
      // Verificar si algún equipo del usuario está inscrito
      const equiposUsuario = await em.find(Equipo, {
        $or: [
          { capitan: usuarioId },
          { jugadores: usuarioId }
        ]
      });

      if (equiposUsuario.length > 0) {
        const equipoIds = equiposUsuario.map(e => e.id);
        // Buscar en InscripcionEquipo si algún equipo del usuario está inscrito
        const inscripcionEquipo = await em.findOne(InscripcionEquipo, {
          equipo: { $in: equipoIds },
          inscripcion: torneo.inscripcion.id
        });
        estaInscrito = !!inscripcionEquipo;
      }
    }

    res.status(200).json({
      message: "Estado de inscripción",
      data: { estaInscrito }
    });

  } catch (error: any) {
    console.error('Error en verificarInscripcion:', error);
    res.status(500).json({ message: error.message });
  }
}

// Obtener todas las inscripciones (solo admin)
export async function findAll(req: Request, res: Response) {
  try {
    const em = orm.em.fork();

    const inscripciones = await em.find(
      Inscripcion,
      {},
      {
        populate: [
          'torneo',
          'inscripcionesIndividuales.usuario',
          'inscripcionesEquipos.equipo',
          'inscripcionesEquipos.inscripcion',
        ],
      }
    );

    res.status(200).json({
      message: "Listado de Inscripciones (Admin)",
      data: inscripciones,
    });
  } catch (error: any) {
    console.error('Error en findAll inscripciones admin:', error);
    res.status(500).json({ message: error.message });
  }
}


// Obtener una inscripción específica (solo admin)
export async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const inscripcion = await em.findOneOrFail(Inscripcion, { id }, {
      populate: ['torneo', 'inscripcionesIndividuales', 'inscripcionesEquipos']
    });
    res.status(200).json({ message: "Inscripción encontrada", data: inscripcion });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Crear inscripción manualmente (solo admin)
export async function add(req: Request, res: Response) {
  try {
    const inscripcion = em.create(Inscripcion, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: "Inscripción creada", data: inscripcion });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Actualizar inscripción (solo admin)
export async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const inscripcion = em.getReference(Inscripcion, id);
    em.assign(inscripcion, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: "Inscripción actualizada" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Eliminar inscripción (solo admin)
export async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const inscripcion = em.getReference(Inscripcion, id);
    await em.removeAndFlush(inscripcion);
    res.status(200).json({ message: "Inscripción eliminada" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Sanitize input
export function sanitizedInscripcionInput(req: Request, res: Response, next: Function) {
  req.body.sanitizedInput = {
    estado: req.body.estado,
    fechaApertura: req.body.fechaApertura,
    fechaCierre: req.body.fechaCierre,
    torneo: req.body.torneo
  };
  Object.keys(req.body.sanitizedInput).forEach(key => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}