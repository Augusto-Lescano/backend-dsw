// service/torneoService/crearTorneoInscripcion.ts
import { EntityManager } from '@mikro-orm/core';
import { Torneo } from '../../torneo/torneo.entity.js';
import { Inscripcion } from '../../inscripcion/inscripcion.entity.js';
import { TipoDeTorneo } from '../../tipoDeTorneo/tipoDeTorneo.entity.js';
import { Juego } from '../../juego/juego.entity.js';
import { Usuario } from '../../usuario/usuario.entity.js';
import { Plataforma } from '../../plataforma/plataforma.entity.js';
import { orm } from '../../shared/db/orm.js';

const em = orm.em;

interface CrearTorneoInput {
  nombre: string;
  descripcionReglas: string;
  cantJugadoresEquipo?: number;
  cantEquipos?: number;
  cantJugadores: number;
  fechaInicio: Date;
  fechaFin: Date;
  fechaInicioIns: Date;
  fechaFinIns: Date;
  region: string;
  tipoDeTorneo: string;
  juego: string;
  plataforma: string;
}

export async function crearTorneoInscripcion(input: CrearTorneoInput, usuarioCreadorId: string) {
  return await em.transactional(async (em: EntityManager) => {
    // Convertir IDs de string a number
    const tipoDeTorneoId = Number(input.tipoDeTorneo);
    const juegoId = Number(input.juego);
    const plataformaId = Number(input.plataforma);
    const creadorId = Number(usuarioCreadorId); // ID del usuario autenticado

    // Validar conversiones
    if (isNaN(tipoDeTorneoId)) throw new Error('ID de tipoDeTorneo inválido');
    if (isNaN(juegoId)) throw new Error('ID de juego inválido');
    if (isNaN(plataformaId)) throw new Error('ID de plataforma inválido');
    if (isNaN(creadorId)) throw new Error('ID de creador inválido');

    // Cargar las entidades relacionadas
    const tipoDeTorneo = await em.findOneOrFail(TipoDeTorneo, { id: tipoDeTorneoId });
    const juego = await em.findOneOrFail(Juego, { id: juegoId });
    const plataforma = await em.findOneOrFail(Plataforma, { id: plataformaId });
    const creador = await em.findOneOrFail(Usuario, { id: creadorId }); // Cargar usuario creador

    // Crear el torneo con valores automáticos
    const torneo = em.create(Torneo, {
      nombre: input.nombre,
      descripcionReglas: input.descripcionReglas,
      cantJugadoresEquipo: input.cantJugadoresEquipo,
      cantEquipos: input.cantEquipos,
      cantJugadores: input.cantJugadores,
      fechaInicio: new Date(input.fechaInicio),
      fechaFin: new Date(input.fechaFin),
      fechaInicioIns: new Date(input.fechaInicioIns),
      fechaFinIns: new Date(input.fechaFinIns),
      resultado: 'Pendiente', // Automáticamente null
      region: input.region,
      estado: 'Pendiente', // Automáticamente "Pendiente"
      tipoDeTorneo: tipoDeTorneo,
      juego: juego,
      creador: creador, // Usuario autenticado
      plataforma: plataforma,
      inscripcion: null as any // Temporal
    });

    // Crear la inscripción asociada
    const inscripcion = em.create(Inscripcion, {
      estado: 'abierta',
      fechaApertura: new Date(input.fechaInicioIns),
      fechaCierre: new Date(input.fechaFinIns),
      torneo: torneo
    });

    // Asignar la inscripción al torneo
    torneo.inscripcion = inscripcion;

    await em.persistAndFlush([torneo, inscripcion]);
    
    return {
      torneo,
      inscripcion
    };
  });
}