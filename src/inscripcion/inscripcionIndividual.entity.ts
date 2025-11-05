import { Entity, Property, ManyToOne, Rel} from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";
import { Inscripcion } from "./inscripcion.entity.js";

@Entity()
export class InscripcionIndividual  extends BaseEntity {

    @Property({nullable: false,default: 'abierta'})
    estado!: string;

    @Property({nullable: false, default: '2024-01-01T00:00:00'})
    fechaApertura!: Date;

    @Property({nullable: false ,default: '2024-12-31T23:59:59'})
    fechaCierre!: Date;

    @ManyToOne(() => Inscripcion, { nullable: false })
    inscripcion!: Rel<Inscripcion>;

    @ManyToOne(() => Usuario, { nullable: false })
    usuario!: Rel<Usuario>;
}