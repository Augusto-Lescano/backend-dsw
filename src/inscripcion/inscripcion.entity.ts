import { Entity, Property, OneToMany, OneToOne, Rel, Collection } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Torneo } from "../torneo/torneo.entity.js";
import { InscripcionIndividual } from "./inscripcionIndividual.entity.js";
import { InscripcionEquipo } from "./inscripcionEquipo.entity.js";

@Entity()
export class Inscripcion extends BaseEntity {

  @Property({ nullable: false, default: 'abierta' })
  estado!: string;

  @Property({ nullable: false })
  fechaApertura!: Date;

  @Property({ nullable: false })
  fechaCierre!: Date;

  @OneToMany(() => InscripcionIndividual, inscIndividual => inscIndividual.inscripcion)
  inscripcionesIndividuales = new Collection<InscripcionIndividual>(this);

  @OneToMany(() => InscripcionEquipo, inscEquipo => inscEquipo.inscripcion)
  inscripcionesEquipos = new Collection<InscripcionEquipo>(this);

  @OneToOne(() => Torneo, torneo => torneo.inscripcion, { 
    nullable: false 
  })
  torneo!: Rel<Torneo>;
}