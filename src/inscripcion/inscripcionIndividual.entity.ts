import { Entity, Property, ManyToOne, Rel} from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";
import { Inscripcion } from "./inscripcion.entity.js";

@Entity()
export class InscripcionIndividual extends BaseEntity {

    @Property({ nullable: false })
    fechaInscripcion: Date = new Date(); // Solo necesitas esta fecha

    @ManyToOne(() => Inscripcion, { nullable: false })
    inscripcion!: Rel<Inscripcion>;

    @ManyToOne(() => Usuario, { nullable: false })
    usuario!: Rel<Usuario>;
}