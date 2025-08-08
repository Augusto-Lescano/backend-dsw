import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";

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
}
