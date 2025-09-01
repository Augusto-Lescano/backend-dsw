import { Entity, Property, Rel, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { TipoDeJuego } from "../tipoDeJuego/tipoDeJuego.entity.js";

@Entity()
export class Juego extends BaseEntity{
  @Property({nullable:false, unique:true})
  nombre!:string

  @Property({nullable:false})
  descripcion!: string

  @ManyToOne(()=>TipoDeJuego,{nullable:false})
  tipoDeJuego!: Rel<TipoDeJuego>
}