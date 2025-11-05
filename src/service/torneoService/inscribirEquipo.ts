import { Equipo } from "../../equipo/equipo.entity.js";
import { orm } from "../../shared/db/orm.js";
import { Torneo } from "../../torneo/torneo.entity.js";
import { validarInscripcionEquipo } from "../inscripcion/validarInscripcion.js";

const em = orm.em;

async function inscribirEquipoEnTorneo(equipoId: any, torneoId: any){

    const torneo = await em.findOne(Torneo, torneoId,{
        populate: ['inscripcion.equipos.jugadores']
    });

    const equipo = await em.findOne(Equipo, equipoId,{
        populate: ['jugadores', 'inscripcion']
    });

    if (!torneo || !equipo){
        throw new Error('Torneo o equipo no encontrado');
    }

    await validarInscripcionEquipo(torneo, equipo);

    equipo.inscripcion = torneo.inscripcion;
    torneo.inscripcion.equipos.add(equipo);

    await em.flush();

    return {
        success: true,
        message: 'Equipo inscrito exitosamente',
        equipo: equipo,
        torneo: torneo.nombre
    };
}



export { inscribirEquipoEnTorneo};
