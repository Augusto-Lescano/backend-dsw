import { Entity, Property, OneToMany, Cascade, Collection } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Torneo } from "../torneo/torneo.entity.js";

@Entity()
export class TipoDeTorneo extends BaseEntity{
 
  @Property({nullable:false, unique:true})
  nombre!: string
  
  @Property({nullable:false})
  descripcion!: string

  @Property({ nullable: false })
  esIndividual!: boolean;
  
  @OneToMany(()=>Torneo,(torneo)=>torneo.tipoDeTorneo, {cascade:[Cascade.ALL]})
  torneos = new Collection<Torneo>(this)
}
