import express, {NextFunction, Request, Response} from 'express' 

import { Usuario } from './usuario.entity.js' 

import { orm } from '../shared/db/orm.js'

 

const em = orm.em 

 

function sanitizeUsuarioInput(req:Request, res:Response, next:NextFunction){ 

    req.body.sanitizedInput = { 

        nombre: req.body.nombre, 

        apellido: req.body.apellido, 

        email: req.body.email, 

        pais: req.body.pais, 

        tag: req.body.tag, 

        rol: req.body.rol, 

    } 

 

    Object.keys(req.body.sanitizedInput).forEach(key=>{ 

        if(req.body.sanitizedInput[key]=== undefined){ 

            delete req.body.sanitizedInput[key] 

        } 

         

    }) 

 

    next()  

 

} 

 

 

async function findAll(req:Request,res: Response){ 

    try{ 

        const usuarios = await em.find(Usuario,{},{populate:["torneos"]}) 

        res.status(200).json({message:'Se encontraron todos los usarios', data: usuarios }) 
        }catch(error:any){ 

        res.status(500).json({message: error.message}) 

    } 

} 

 

 

async function findOne(req:Request,res: Response){ 

    try{ 

        const id = Number.parseInt(req.params.id) 

        const usuario = await em.findOneOrFail(Usuario,{id},{populate:["torneos"]}) 

        res.status(200).json({message:'Se encontro el usuario', data: usuario }) 

 

    }catch(error:any){ 

        res.status(500).json({message: error.message}) 

    } 

} 

 

 

async function add(req:Request, res: Response){ 

    try{ 

        delete req.body.sanitizedInput.id; 

        const usuario = em.create(Usuario, req.body.sanitizedInput) 

        await em.flush() 

        res.status(201).json({message:'Usuario creado', data: usuario }) 

 

    }catch(error:any){ 

        res.status(500).json({message: error.message}) 

    } 

} 

 

async function update(req:Request, res: Response){ 

    try{ 

        const id = Number.parseInt(req.params.id) 

        const usuarioUpdate = await em.findOneOrFail(Usuario, {id}) 

        em.assign(usuarioUpdate, req.body.sanitizedInput) 

        await em.flush() 

        res.status(201).json({message:'Usuario actualizado', data: usuarioUpdate }) 

 

    }catch(error:any){ 

        res.status(500).json({message: error.message}) 

    } 

} 

 

async function remove(req:Request, res: Response){ 

    try{ 

        const id = Number.parseInt(req.params.id) 
                const usuarioDelete = em.getReference(Usuario, id) 

        await em.removeAndFlush(usuarioDelete) 

        res.status(200).json({message:'Usuario eliminado', data: usuarioDelete }) 

 

    }catch(error:any){ 

        res.status(500).json({message: error.message}) 

    } 

} 

 

 

export {sanitizeUsuarioInput, findAll, findOne, add, update, remove } 