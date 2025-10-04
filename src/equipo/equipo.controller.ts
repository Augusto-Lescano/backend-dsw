import { Request, Response, NextFunction} from 'express';
import { Equipo } from './equipo.entity.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

function sanitizeEquipoInput(req:Request, res:Response, next:NextFunction){
    req.body.sanitizedInput = {
        nombre: req.body.nombre
    }

    Object.keys(req.body.sanitizedInput).forEach(key=>{ 
        if(req.body.sanitizedInput[key]=== undefined){ 
            delete req.body.sanitizedInput[key] 
        } 
    })

    next()
}

async function findAll(req:Request, res:Response){
    try {
        const equipos = await em.find(Equipo,{},{populate:["usuarios", "torneos", /*"inscripciones"*/]})

        res.status(200).json({
            message:'Se encontraron todos los equipos',
            data: equipos
        });
    } catch(error:any) { 
        res.status(500).json({message: error.message}) ;
    }
}

async function findOne(req:Request,res: Response){ 
    try { 
        const id = Number.parseInt(req.params.id) 
        const equipo = await em.findOneOrFail(Equipo,{id},{populate:["usuarios", "torneos", /*"inscripciones"*/]}) 

        res.status(200).json({
            message:'Se encontró el equipo',
            data: equipo
        });
    } catch(error:any) {  
        res.status(500).json({message: error.message}) 
    } 
} 

async function add(req:Request, res:Response){
  try {
    const equipo = em.create(Equipo, req.body.sanitizedInput)
    await em.flush()

    res.status(201).json({
        message: "Equipo creado",
        data: equipo
    });
  } catch (error:any) {
    res.status(500).json({message:error.message})
  }
}

async function update(req:Request, res: Response){ 
    try { 
        const id = Number.parseInt(req.params.id) 
        const equipoUpdate = await em.findOneOrFail(Equipo, {id}) 
        em.assign(equipoUpdate, req.body.sanitizedInput) 
        await em.flush() 

        res.status(201).json({
            message:'Equipo actualizado',
            data: equipoUpdate
        }); 
    } catch(error:any) { 
        res.status(500).json({message: error.message}) 
    } 
} 

async function remove(req:Request, res: Response){ 
    try { 
        const id = Number.parseInt(req.params.id) 
        const equipoDelete = em.getReference(Equipo, id) 
        await em.removeAndFlush(equipoDelete) 

        res.status(200).json({
            message:'Equipo eliminado',
            data: equipoDelete
        }); 
    } catch(error:any) { 
        res.status(500).json({message: error.message}) 
    } 
} 

export { sanitizeEquipoInput, findAll, findOne, add, update, remove } 