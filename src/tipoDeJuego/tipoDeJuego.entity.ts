import crypto from "node:crypto"
export class TipoDeJuego{
  constructor(
    public nombre:string,
    public descripcion:string,
    public id = crypto.randomUUID()
  ){}
}