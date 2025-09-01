
import { Entity, Property, OneToMany, Collection, Cascade } from "@mikro-orm/core"
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Juego } from "../juego/juego.entity.js"

@Entity()
export class TipoDeJuego extends BaseEntity{

  @Property({nullable:false, unique:true})
  nombre!:string
  
  @Property({nullable:false})
  descripcion!:string
  
  @OneToMany(()=>Juego, (juego)=>juego.tipoDeJuego, {cascade:[Cascade.ALL]})
  juegos = new Collection<Juego>(this)
}