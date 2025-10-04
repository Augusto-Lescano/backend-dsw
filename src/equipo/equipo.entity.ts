import { Entity, Property, Rel, ManyToMany, Cascade, Collection } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Usuario } from "../usuario/usuario.entity.js";
import { Torneo } from "../torneo/torneo.entity.js";
// import { Inscripcion } from "../inscripcion/inscripcion.entity.js";

@Entity()
export class Equipo extends BaseEntity{
    @Property({nullable:false, unique:true})
    nombre!:string

    @ManyToMany(()=>Usuario,(usuario)=>usuario.equipos,{cascade:[Cascade.ALL],owner:true})
    usuarios = new Collection<Usuario>(this);

    @ManyToMany(()=>Torneo,(torneo)=>torneo.equipos)
    torneos = new Collection<Torneo>(this);

    /*@ManyToOne(()=>Inscripcion,(inscripcion)=>inscripcion.equipos,{cascade:[Cascade.ALL],owner:true})
    inscripciones!: Inscripcion[]*/
}