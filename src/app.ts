import 'reflect-metadata' 

import express from 'express' 

import { torneoRouter } from './torneo/torneo.routes.js' 
import { usuarioRouter } from './usuario/usuario.routes.js' 

import { tipoDeTorneoRouter } from './tipoDeTorneo/tipoDeTorneo.routes.js'; 

import { tipoDeJuegoRouter } from './tipoDeJuego/tipoDeJuego.routes.js'; 

import { orm, syncSchema } from './shared/db/orm.js';

import { RequestContext } from '@mikro-orm/core' 

 

const app = express(); 

app.use(express.json()); 

 

app.use((req, res, next) => { 

  RequestContext.create(orm.em, next) 

}) 

 

app.use('/api/torneos', torneoRouter) 

app.use('/api/usuarios', usuarioRouter) 

app.use('/api/tipoDeTorneo',tipoDeTorneoRouter) 

app.use("/api/tipoDeJuego",tipoDeJuegoRouter) 

 

app.use((req,res)=>{ 

    res.status(404).send({message:'Resource not found'}) 

}) 

 

await syncSchema()  

 

app.listen(3000,()=>{ 

    console.log("Server running on http://localhost:3000/") 

}) 

 