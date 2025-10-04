import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import type { Usuario } from "../usuario/usuario.entity.js";
import type { Torneo } from "../torneo/torneo.entity.js";

@Entity()
export class Inscripcion extends BaseEntity {

  @Property({nullable: false})
  estado!: string;

  @Property({nullable: false})
  fecha!: Date;

  @ManyToOne({ entity: () => 'Usuario', nullable: false })
  usuario!: Usuario;

  @ManyToOne({ entity: () => 'Torneo', nullable: false })
  torneo!: Torneo;
}
