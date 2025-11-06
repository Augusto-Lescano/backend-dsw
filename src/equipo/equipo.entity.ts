import { Entity, Property, Rel, ManyToMany, Cascade, Collection,ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";
import { Torneo } from "../torneo/torneo.entity.js";
import { Inscripcion } from "../inscripcion/inscripcion.entity.js";

@Entity()
export class Equipo extends BaseEntity{
    @Property({nullable:false, unique:true})
    nombre!:string

    @ManyToOne(() => Usuario, { nullable: false })
    capitan!: Rel<Usuario>;

    @ManyToMany(() => Usuario, user => user.equipos, { 
        cascade: [Cascade.ALL],
        owner: true 
    })
    jugadores = new Collection<Usuario>(this);

    @ManyToOne(() => Inscripcion,{ nullable: true })
    inscripcion?: Rel<Inscripcion>;

    /*@ManyToOne(()=>Inscripcion,(inscripcion)=>inscripcion.equipos,{cascade:[Cascade.ALL],owner:true})
    inscripciones!: Inscripcion[]*/
}