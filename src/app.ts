import express from 'express'
import { torneoRouter } from './torneo/torneo.routes.js'
import { usuarioRouter } from './usuario/usuario.routes.js'
import { tipoDeTorneoRouter } from './tipoDeTorneo/tipoDeTorneo.routes.js';

const app = express();
app.use(express.json());

app.use('/api/torneos', torneoRouter)
app.use('/api/usuarios', usuarioRouter)
app.use('/api/tipoDeTorneo',tipoDeTorneoRouter)

app.use((req,res)=>{
    res.status(404).send({message:'Resource not found'})
})

app.listen(3000,()=>{
    console.log("Server running on http://localhost:3000/")
})
