import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Entity, Property, ManyToMany, Cascade, Collection, OneToMany } from "@mikro-orm/core";
import { Juego } from "../juego/juego.entity.js";
import { Torneo } from "../torneo/torneo.entity.js";

@Entity()
export class Plataforma extends BaseEntity{
  @Property({unique:true, nullable:false})
  nombre!: string

  @Property({unique:true, nullable:false})
  descripcion!: string

  @ManyToMany(()=>Juego, (juego)=>juego.plataformas)
  juegos = new Collection<Juego>(this)

  @OneToMany(()=>Torneo, (torneo)=>torneo.plataforma, {nullable:false})
  torneos = new Collection<Torneo>(this)
}