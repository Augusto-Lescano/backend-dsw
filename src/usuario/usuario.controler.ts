import express, {NextFunction, Request, Response} from 'express'
import { Usuario } from './usuario.entity.js'
import { UsuarioRepository } from './usuario.repository.js'
const repository = new UsuarioRepository()

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


function findAll(req:Request,res: Response){
    res.json({data: repository.findAll()})
}


function findOne(req:Request,res: Response){
    const usuario = repository.findOne({id:req.params.id})
    if(!usuario){
       res.status(404).send({message:'Usuario not found'})
       return
    }
    res.json(usuario)
}


function add(req:Request, res: Response){
    const input = req.body.sanitizedInput

    const usuarioInput = new Usuario(
        input.name, 
        input.nombre, 
        input.apellido, 
        input.email, 
        input.pais,
        input.tag, 
        input.rol
    )

    const usuario = repository.add(usuarioInput)
    res.status(201).send({message: 'Usuario created', data:usuario})   
    return
}

function update(req:Request, res: Response){
    req.body.sanitizedInput.id = req.params.id
    const usuario =repository.update(req.body.sanitizedInput)


    if(!usuario){
        res.status(404).send({message:'Usuario not found'})
        return
    }

    res.status(200).send({message:'Usuario update succesfully', data:usuario})
    return
}

function remove(req:Request, res: Response){
    const id = req.params.id
    const usuario = repository.delete({id})
    

    if(!usuario){
        res.status(404).send({message:'Usuario not found'})
        
    }else{
        res.status(200).send({message:'Usuario deleted succesfully'})
    }
    
    
}


export {sanitizeUsuarioInput, findAll, findOne, add, update, remove }