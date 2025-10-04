import 'reflect-metadata';
import express from 'express';
import { Request, Response } from 'express';
import { torneoRouter } from './torneo/torneo.routes.js';
import { usuarioRouter } from './usuario/usuario.routes.js';
import { tipoDeTorneoRouter } from './tipoDeTorneo/tipoDeTorneo.routes.js';
import { tipoDeJuegoRouter } from './tipoDeJuego/tipoDeJuego.routes.js';
import { juegoRouter } from './juego/juego.routes.js';
import { orm, syncSchema } from './shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { inscripcionRouter } from './inscripcion/inscripcion.routes.js';

const app = express();
app.use(express.json());

//Luego de los middlewares base
app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})
//Antes de las rutas y middlewares de negocio

app.use('/api/torneos', torneoRouter)
app.use('/api/usuarios', usuarioRouter)
app.use('/api/tipoDeTorneo',tipoDeTorneoRouter)
app.use("/api/tipoDeJuego",tipoDeJuegoRouter)
app.use("/api/juego", juegoRouter)
app.use('/api/inscripcion', inscripcionRouter)

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Resource not found' });
});

await syncSchema() //never in production

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})