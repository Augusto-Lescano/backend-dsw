import { Collection, Entity, Property, OneToMany, Cascade, ManyToMany } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Torneo } from "../torneo/torneo.entity.js";
import { Equipo } from "../equipo/equipo.entity.js";
import { InscripcionIndividual } from "../inscripcion/inscripcionIndividual.entity.js";

@Entity()
export class Usuario extends BaseEntity {
  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  apellido!: string;

  @Property({ nullable: false, unique: true })
  email!: string;

  @Property({ nullable: false, unique: true })
  nombreUsuario!: string;

  @Property({ nullable: false })
  contrasenia!: string;

  @Property({ nullable: false })
  pais!: string;

  @Property({ nullable: false, default: 'user' }) //Valor por defecto
  rol!: string;

  @ManyToMany(() => Equipo, equipo => equipo.jugadores)
  equipos = new Collection<Equipo>(this);

  @OneToMany(() => Torneo, torneo => torneo.creador)
  torneosCreados = new Collection<Torneo>(this)

  @OneToMany(() => InscripcionIndividual, inscripcion => inscripcion.usuario)
  inscripciones = new Collection<InscripcionIndividual>(this);
}