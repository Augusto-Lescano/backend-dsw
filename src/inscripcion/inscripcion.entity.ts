import { Entity, Property, OneToMany,OneToOne, Rel,Collection,Cascade} from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Equipo } from "../equipo/equipo.entity.js";
import { Torneo } from "../torneo/torneo.entity.js";
import { InscripcionIndividual } from "./inscripcionIndividual.entity.js";

@Entity()
export class Inscripcion extends BaseEntity {

  @Property({nullable: false,default: 'abierta'})
  estado!: string;

  @Property({nullable: false, default: '2024-01-01T00:00:00' })
  fechaApertura!: Date;

  @Property({nullable: false, default: '2024-12-31T23:59:59' })
  fechaCierre!: Date;

  @OneToMany(() => Equipo, equipo => equipo.inscripcion, {
        cascade: [Cascade.ALL]
    })
    equipos = new Collection<Equipo>(this);

    @OneToMany(() => InscripcionIndividual, inscIndividual => inscIndividual.inscripcion)
    inscripcionesIndividuales = new Collection<InscripcionIndividual>(this);

  @OneToOne(() => Torneo, torneo => torneo.inscripcion, { 
        nullable: false 
    })
    torneo!: Rel<Torneo>;
}
