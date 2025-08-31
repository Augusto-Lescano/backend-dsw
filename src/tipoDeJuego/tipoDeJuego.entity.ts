
import { Entity, Property, OneToMany, Collection, Cascade } from "@mikro-orm/core"
import { BaseEntity } from "../shared/db/baseEntity.entity.js"

@Entity()
export class TipoDeJuego extends BaseEntity{

  @Property({nullable:false, unique:true})
  nombre!:string
  
  @Property({nullable:false})
  descripcion!:string
  /*
  @OneToMany()
  juegos = new Collection<Juego>
  */
  
}