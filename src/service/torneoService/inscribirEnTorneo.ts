import { orm } from "../../shared/db/orm.js";
//import { inscribirEquipoEnTorneo } from "./inscribirEquipo.js";
//import { inscribirUsuarioEnTorneo } from "./inscribirIndividual.js";
//import { Torneo } from "../../torneo/torneo.entity.js";

const em = orm.em;

async function inscribirEnTorneo(torneoId: any, inscripcionData: any) {

    const { inscribirEquipoEnTorneo } = await import("./inscribirEquipo.js");
    const { inscribirUsuarioEnTorneo } = await import("./inscribirIndividual.js");
    const { Torneo } = await import("../../torneo/torneo.entity.js");

    const torneo = await em.findOne(Torneo, torneoId, {
        populate: ['tipoDeTorneo']
    });

    if (!torneo) {
        throw new Error('Torneo no encontrado');
    }

    if (torneo.tipoDeTorneo.esIndividual) {

        if (!inscripcionData.usuarioId) {
            throw new Error('Para torneos individuales se requiere usuarioId');
        }
        return await inscribirUsuarioEnTorneo(inscripcionData.usuarioId, torneoId);
    } else {

        if (!inscripcionData.equipoId) {
            throw new Error('Para torneos por equipos se requiere equipoId');
        }
        return await inscribirEquipoEnTorneo(inscripcionData.equipoId, torneoId);
    }
    
}
export { inscribirEnTorneo };