import crypto from 'node:crypto';
import { receiveMessageOnPort } from 'node:worker_threads';

export class Torneo {
    constructor(
        public id: string = crypto.randomUUID(),
        public nombre: string,
        public descripcionReglas: string,
        public cantidadJugadores: number,
        public fechaInicio: string,
        public fechaFin: string,
        public fechaInicioIns: string,
        public fechaFinIns: string,
        public resultado: string = '',
        public region: string,
        public estado: string = ''
    ) {}
}

