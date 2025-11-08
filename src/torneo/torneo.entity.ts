import { Entity, Property, ManyToOne, Rel, Cascade , OneToOne, Collection, ManyToMany } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { TipoDeTorneo } from '../tipoDeTorneo/tipoDeTorneo.entity.js';
import { Juego } from '../juego/juego.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { Inscripcion } from '../inscripcion/inscripcion.entity.js';
import { Plataforma } from '../plataforma/plataforma.entity.js';

@Entity()
export class Torneo extends BaseEntity {
    @Property({nullable: false})
    nombre!: string

    @Property({nullable: false})
    descripcionReglas!: string

    @Property({nullable: false})
    cantJugadoresEquipo!: number

    @Property({nullable: false})
    cantEquipos!: number

    @Property({nullable: false})
    cantJugadores!: number

    @Property({nullable: false})
    fechaInicio!: Date

    @Property({nullable: false})
    fechaFin!: Date

    @Property({nullable: false})
    fechaInicioIns!: Date

    @Property({nullable: false})
    fechaFinIns!: Date

    @Property({nullable: true})
    resultado!: string

    @Property({nullable: false})
    region!: string

    @Property({nullable: false})
    estado!: string

    @ManyToOne(()=>TipoDeTorneo,{nullable:false})
    tipoDeTorneo!: Rel<TipoDeTorneo>

    @ManyToOne(()=>Juego, {nullable:false})
    juego!: Rel<Juego>

    @ManyToOne(()=>Usuario,{ nullable: false })
    creador!: Rel<Usuario>

    /*@ManyToMany(()=>Equipo,(equipo)=>equipo.torneos,{cascade:[Cascade.ALL], owner:true})
    equipos = new Collection<Equipo>(this);*/

    @OneToOne(() => Inscripcion, inscripcion => inscripcion.torneo, { 
        cascade: [Cascade.ALL],
        owner: true
    })
    inscripcion!: Rel<Inscripcion>;
    
    @ManyToOne(()=>Plataforma, {nullable:false})
    plataforma!: Rel<Plataforma>

}

