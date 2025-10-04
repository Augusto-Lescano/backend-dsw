import { Collection, Entity, Property, OneToMany } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Torneo } from "../torneo/torneo.entity.js";
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

  @OneToMany(() => Torneo, torneo => torneo.creador)
  torneosCreados = new Collection<Torneo>(this)

  @OneToMany(() => Inscripcion, inscripcion => inscripcion.usuario)
  inscripciones = new Collection<Inscripcion>(this);

}
