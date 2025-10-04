import { Collection, Entity, Property, OneToMany, Cascade, ManyToMany } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Torneo } from "../torneo/torneo.entity.js";
import { Equipo } from "../equipo/equipo.entity.js";
import { Inscripcion } from "../inscripcion/inscripcion.entity.js";

@Entity()
export class Usuario extends BaseEntity {
  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  apellido!: string;

  @Property({ nullable: false, unique: true })
  email!: string;

  @Property({ nullable: true })
  pais?: string;

  @Property({ nullable: true })
  tag?: string;

  @Property({ nullable: true })
  rol?: string;

  @ManyToMany(()=>Equipo,(equipo)=>equipo.usuarios,{cascade:[Cascade.ALL]})
  equipos = new Collection<Equipo>(this);

  @OneToMany(() => Torneo, torneo => torneo.creador)
  torneosCreados = new Collection<Torneo>(this)

  @OneToMany(() => Inscripcion, inscripcion => inscripcion.usuario)
  inscripciones = new Collection<Inscripcion>(this);

}
