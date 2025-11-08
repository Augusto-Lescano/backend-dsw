import { orm } from "../../shared/db/orm.js";

const em = orm.em; 

async function inscribirUsuarioEnTorneo(usuarioId: any, torneoId:any){

    const { Torneo } = await import("../../torneo/torneo.entity.js");
    const { validarInscripcionIndividual } = await import("../inscripcion/validarInscripcion.js");
    const { Usuario } = await import("../../usuario/usuario.entity.js");
    const { InscripcionIndividual } = await import("../../inscripcion/inscripcionIndividual.entity.js");

    const torneo = await em.findOne(Torneo, torneoId,{
        populate: ['inscripcion', 'tipoDeTorneo']
    });

    const usuario = await em.findOne(Usuario, usuarioId);

    if (!torneo || !usuario){
        throw new Error('Torneo o usuario no encontrado');
    }

    await validarInscripcionIndividual(torneo, { usuarioId });

    const inscripcionIndividual = em.create(InscripcionIndividual, {
        estado: 'confirmada',
        fechaApertura: new Date(),
        fechaCierre: new Date(),
        inscripcion: torneo.inscripcion,
        usuario: usuario
    });

    await em.persistAndFlush(inscripcionIndividual);
    return {
        success: true,
        message: 'Usuario inscrito exitosamente en el torneo',
        usuario: usuario,
        torneo: torneo.nombre,
        inscripcion: inscripcionIndividual
    };
}

export {inscribirUsuarioEnTorneo};
