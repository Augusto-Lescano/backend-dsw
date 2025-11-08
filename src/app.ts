import 'reflect-metadata';
import express from 'express';
import { Request, Response } from 'express';
import { orm, syncSchema } from './shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';
import cors from "cors";
import cookieParser from 'cookie-parser'
import { authMiddleware } from './shared/middleware/auth.middleware.js';

//Routers
import { torneoRouter } from './torneo/torneo.routes.js';
import { usuarioRouter } from './usuario/usuario.routes.js';
import { tipoDeTorneoRouter } from './tipoDeTorneo/tipoDeTorneo.routes.js';
import { tipoDeJuegoRouter } from './tipoDeJuego/tipoDeJuego.routes.js';
import { juegoRouter } from './juego/juego.routes.js';
import { equipoRouter } from './equipo/equipo.routes.js';
import { plataformaRouter } from './plataforma/plataforma.routes.js';
import { inscripcionRouter } from './inscripcion/inscripcion.routes.js';


const app = express();

app.use(express.json()); // Mira si la req tiene algo en el body, de ser asi lo deja en el req.body
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // El origen del frontend
  credentials: true // Importante para cookies
})); //Habilitar CORS para todas las rutas

// Middleware de autenticación
app.use(authMiddleware);

// Middleware de MikroORM
app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
});

// Rutas
app.use('/api/torneos', torneoRouter)
app.use('/api/usuarios', usuarioRouter)
app.use('/api/tipoDeTorneo', tipoDeTorneoRouter)
app.use("/api/tipoDeJuego", tipoDeJuegoRouter)
app.use("/api/juego", juegoRouter)
app.use("/api/equipos", equipoRouter) 
app.use('/api/inscripcion', inscripcionRouter)
app.use("/api/plataforma", plataformaRouter)

// Manejo de rutas no encontradas
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Sincronizar esquema (solo desarrollo)
await syncSchema()

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000/')
});
