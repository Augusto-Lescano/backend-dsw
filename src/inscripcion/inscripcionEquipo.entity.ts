import { Entity, Property, ManyToOne, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Equipo } from "../equipo/equipo.entity.js";
import { Inscripcion } from "./inscripcion.entity.js";

@Entity()
export class InscripcionEquipo extends BaseEntity {

    @Property({ nullable: false })
    fechaInscripcion: Date = new Date();

    @ManyToOne(() => Inscripcion, { nullable: false })
    inscripcion!: Rel<Inscripcion>;

    @ManyToOne(() => Equipo, { nullable: false })
    equipo!: Rel<Equipo>;
}