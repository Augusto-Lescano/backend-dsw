import { FilterQuery } from "@mikro-orm/core";
import { Inscripcion } from "../../inscripcion/inscripcion.entity.js";
import { InscripcionIndividual } from "../../inscripcion/inscripcionIndividual.entity.js";
import { orm } from "../../shared/db/orm.js";
import { Usuario } from "../../usuario/usuario.entity.js";

const em = orm.em;

async function validarInscripcionEquipo(torneo: any, equipo: any) {

    const inscripcion = torneo.inscripcion;

    if (inscripcion.estado !== 'Abierta'){
        throw new Error('Las inscripciones no están abiertas');
    }

    if (equipo.inscripcion){
        throw new Error('El equipo ya está inscrito en un torneo');
    }

    if (equipo.jugadores.length !== torneo.cantJugadoresEquipo){
        throw new Error(`El equipo debe tener exactamente ${torneo.cantJugadoresEquipo} jugadores`);
    }

    if (inscripcion.equipos.length >= torneo.cantEquipos){
        throw new Error('El torneo ha alcanzado el máximo de equipos');
    }

}

async function validarInscripcionIndividual(torneo: any, inscripcionData: any) {


    if (!inscripcionData.usuarioId){
        throw new Error('Para torneos individuales debe inscribirse un usuario');
    }
    
    if (inscripcionData.equipoId){
        throw new Error('Los torneos individuales no permiten inscripción por equipos');
    }

    const usuario = await em.findOne(Usuario, inscripcionData.usuarioId);
    if (!usuario){
        throw new Error('Usuario no encontrado');
    }

    const usuarioInscrito = await em.findOne(InscripcionIndividual,{
        inscripcion: { id: torneo.inscripcion.id },
        usuario: { id: inscripcionData.usuarioId }
    } as FilterQuery<InscripcionIndividual>);

    if (usuarioInscrito) {
        throw new Error('El usuario ya está inscrito en este torneo');
    }

    const inscripcionesCount = await em.count(InscripcionIndividual, {
         inscripcion: { id: torneo.inscripcion.id }
    }as FilterQuery<InscripcionIndividual>);

    if (inscripcionesCount >= torneo.cantJugadores) { 
        throw new Error('El torneo ha alcanzado el máximo de jugadores');
    }

    return { tipo: 'individual', usuario, valido: true };
}

export { validarInscripcionEquipo, validarInscripcionIndividual};