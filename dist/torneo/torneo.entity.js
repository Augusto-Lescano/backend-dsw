import crypto from 'node:crypto';
export class Torneo {
    constructor(id = crypto.randomUUID(), nombre, descripcionReglas, cantidadJugadores, fechaInicio, fechaFin, fechaInicioIns, fechaFinIns, resultado = '', region, estado = '') {
        this.id = id;
        this.nombre = nombre;
        this.descripcionReglas = descripcionReglas;
        this.cantidadJugadores = cantidadJugadores;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.fechaInicioIns = fechaInicioIns;
        this.fechaFinIns = fechaFinIns;
        this.resultado = resultado;
        this.region = region;
        this.estado = estado;
    }
}
//# sourceMappingURL=torneo.entity.js.map