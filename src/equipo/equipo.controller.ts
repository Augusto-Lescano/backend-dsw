import { Request, Response, NextFunction} from 'express';
import { Equipo } from './equipo.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { orm } from '../shared/db/orm.js';

function sanitizeEquipoInput(req:Request, res:Response, next:NextFunction){
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
				descripcion: req.body.descripcion,
        capitan: req.body.capitan,  
        jugadores: req.body.jugadores
    }

    Object.keys(req.body.sanitizedInput).forEach(key=>{ 
        if(req.body.sanitizedInput[key]=== undefined){ 
            delete req.body.sanitizedInput[key] 
        } 
    })

    next()
}

async function findAll(req:Request, res:Response){
    const em = orm.em.fork();
    try {
        // REMOVER "inscripcion" del populate ya que no existe más
        const equipos = await em.find(Equipo,{},{populate:["capitan", "jugadores"]})

        res.status(200).json({
            message:'Se encontraron todos los equipos',
            data: equipos
        });
    } catch(error:any) { 
        res.status(500).json({message: error.message}) ;
    }
}

async function findOne(req:Request,res: Response){
    const em = orm.em.fork(); 
    try { 
        const id = Number.parseInt(req.params.id) 
        // REMOVER "inscripcion" y "inscripcion.torneo" del populate
        const equipo = await em.findOneOrFail(Equipo,{id},{populate:["capitan", "jugadores"]}) 

        res.status(200).json({
            message:'Se encontró el equipo',
            data: equipo
        });
    } catch(error:any) {  
        res.status(500).json({message: error.message}) 
    } 
} 


async function add(req: Request, res: Response) {
  const em = orm.em.fork();

  try {
    const { nombre, descripcion, capitan, jugadores } = req.body.sanitizedInput;

    if (!capitan) {
      res.status(400).json({ message: "El equipo debe tener un capitán" });
    }

    // Crear el equipo base
    const equipo = em.create(Equipo, {
      nombre,
      descripcion,
      capitan: await em.getReference(Usuario, capitan),
    });

    // Persistimos el equipo para que MikroORM lo rastree antes de modificar relaciones
    em.persist(equipo);

    // Si vienen jugadores, los agregamos
    if (Array.isArray(jugadores) && jugadores.length > 0) {
      const jugadoresEntidades = await em.find(Usuario, { id: { $in: jugadores } });

      if (jugadoresEntidades.length > 0) {
        jugadoresEntidades.forEach((jugador) => equipo.jugadores.add(jugador));
        console.log(`✅ Se agregaron ${jugadoresEntidades.length} jugadores al equipo.`);
      } else {
        console.warn("⚠️ No se encontraron jugadores con los IDs enviados.");
      }
    }

    // Guardamos todo
    await em.flush();

    console.log("✅ Equipo creado con éxito:", equipo);

    res.status(201).json({
      message: "Equipo creado correctamente",
      data: equipo,
    });

  } catch (error: any) {
    console.error("❌ Error al crear equipo:", error);
    res.status(500).json({ message: error.message });
  }
}


async function update(req:Request, res: Response){
    const em = orm.em.fork(); 
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
    const em = orm.em.fork(); 
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