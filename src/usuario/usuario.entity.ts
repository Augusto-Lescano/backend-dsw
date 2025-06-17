import crypto from 'node:crypto'

export class Usuario{
    constructor(
        public id = crypto.randomUUID(),
        public nombre: string,
        public apellido:string,
        public email: string,
        public pais:string,
        public tag:string,
        public rol:string,
    ) {}
}