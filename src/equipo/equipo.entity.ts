import { Entity, Property, Rel, ManyToMany, Cascade, Collection,ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";

@Entity()
export class Equipo extends BaseEntity {
  @Property({ nullable: false, unique: true })
  nombre!: string;

  @Property({ nullable: true })
  descripcion?: string;

  @ManyToOne(() => Usuario, { nullable: false })
  capitan!: Rel<Usuario>;

  @ManyToMany(() => Usuario, user => user.equipos, { owner: true })
  jugadores = new Collection<Usuario>(this);
}
