import { Entity, Property, Rel, ManyToOne, OneToMany, Collection, Cascade } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { TipoDeJuego } from "../tipoDeJuego/tipoDeJuego.entity.js";
import { Torneo } from "../torneo/torneo.entity.js";

@Entity()
export class Juego extends BaseEntity{
  @Property({nullable:false, unique:true})
  nombre!:string

  @Property({nullable:false})
  descripcion!: string

  @ManyToOne(()=>TipoDeJuego,{nullable:false})
  tipoDeJuego!: Rel<TipoDeJuego>

  @OneToMany(()=>Torneo,(torneo)=>torneo.juego, {cascade:[Cascade.ALL]})
  torneos = new Collection<Torneo>(this)
}