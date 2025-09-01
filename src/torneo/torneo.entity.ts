import { Entity, Property, ManyToOne, Rel, ManyToMany, Cascade } from '@mikro-orm/core';
import { receiveMessageOnPort } from 'node:worker_threads';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { TipoDeTorneo } from '../tipoDeTorneo/tipoDeTorneo.entity.js';
import { Juego } from '../juego/juego.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';

@Entity()
export class Torneo extends BaseEntity {
    @Property({nullable: false})
    nombre!: string

    @Property({nullable: false})
    descripcionReglas!: string

    @Property({nullable: false})
    cantidadJugadores!: number

    @Property({nullable: false})
    fechaInicio!: string

    @Property({nullable: false})
    fechaFin!: string

    @Property({nullable: false})
    fechaInicioIns!: string

    @Property({nullable: false})
    fechaFinIns!: string

    @Property({nullable: false})
    resultado!: string

    @Property({nullable: false})
    region!: string

    @Property({nullable: false})
    estado!: string

    @ManyToOne(()=>TipoDeTorneo,{nullable:false})
    tipoDeTorneo!: Rel<TipoDeTorneo>

    @ManyToOne(()=>Juego, {nullable:false})
    juego!: Rel<Juego>

    @ManyToMany(()=>Usuario,(usuario)=>usuario.torneos,{cascade:[Cascade.ALL], owner:true})
    usuarios!: Usuario[]

}

