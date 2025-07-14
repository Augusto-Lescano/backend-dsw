import crypto from "node:crypto"
export class TipoDeTorneo{
 constructor(
 public nombre:string,
 public descripcion:string,
 public id = crypto.randomUUID()
 ){}
}
