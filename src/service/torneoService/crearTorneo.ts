import { Inscripcion } from '../../inscripcion/inscripcion.entity.js';
import { orm } from '../../shared/db/orm.js';
import { Torneo } from '../../torneo/torneo.entity.js';
import { calcularEstadoInscripcion } from '../inscripcion/estadoInscripcion.js';

const em = orm.em;


async function crearTorneoInscripcion (torneoData: any){

    if (new Date(torneoData.fechaInicioIns) >= new Date(torneoData.fechaFinIns)){
        throw new Error('La fecha de fin de inscripción debe ser posterior a la de inicio');
    }

    if (new Date(torneoData.fechaInicio) <= new Date(torneoData.fechaFinIns)){
        throw new Error('El torneo debe comenzar después del cierre de inscripciones');
    }

    const estadoTorneo = calcularEstadoTorneo (torneoData.fechaInicio,torneoData.fechaFin );

    const torneo = em.create(Torneo, {
        ...torneoData,
        fechaInicio: new Date(torneoData.fechaInicio),
        fechaFin: new Date(torneoData.fechaFin),
        fechaInicioIns: new Date(torneoData.fechaInicioIns),
        fechaFinIns: new Date(torneoData.fechaFinIns),
        estado: estadoTorneo
    });


    const estadoInscripcion = calcularEstadoInscripcion(torneo.fechaInicioIns, torneo.fechaFinIns);

    const inscripcion = em.create(Inscripcion,{
        fechaApertura: torneo.fechaInicioIns,
        fechaCierre: torneo.fechaFinIns,
        estado: estadoInscripcion,
        torneo: torneo,
        equipos: []
    });

    await em.persistAndFlush([torneo, inscripcion]);

    return { 
        torneo: torneo,
        inscripcion: inscripcion 
    };
}

function calcularEstadoTorneo (fechaIni: any, fechaFin: any): string{
    const ahora = new Date();
    if (ahora < fechaIni) return 'Proximamente';
    if (ahora >= fechaFin) return 'Terminado';
    return 'En curso';
}

export {crearTorneoInscripcion}