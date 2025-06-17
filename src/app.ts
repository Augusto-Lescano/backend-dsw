import express, {NextFunction, Request, Response} from 'express'
import { Usuario } from './usuario/usuario.entity.js'
import { UsuarioRepository } from './usuario/usuario.repository.js'
import { usuarioRouter } from './usuario/usuario.routes.js'

const app = express()
app.use(express.json())
app.use('/api/usuarios',usuarioRouter)

function sanitizeUsuarioInput(req:Request, res:Response, next:NextFunction){
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        pais: req.body.pais,
        tag: req.body.tag,
        rol: req.body.rol,
    }

    Object.keys(req.body.sanitizeInput).forEach(key=>{
        if(req.body.sanitizeInput[key]=== undefined){
            delete req.body.sanitizeInput[key]
        }
        
    })

    next() 

}


app.use((req,res)=>{
    res.status(404).send({message:'Resource not found'})
})

app.listen(3000,()=>{
    console.log("Server running on http://localhost:3000/")
})

