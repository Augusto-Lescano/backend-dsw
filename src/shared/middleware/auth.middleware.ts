import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '../../../config.js';
import { orm } from '../db/orm.js';
import { Equipo } from '../../equipo/equipo.entity.js';

// Extiende la interfaz Request de Express para incluir session
declare global {
  namespace Express {
    interface Request {
      session?: {
        usuario?: any;
      };
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies.token_acceso;
   console.log('🔹 Token recibido:', token);
  req.session = { usuario: null };

  if (!token) {
    return next(); // Continúa sin usuario autenticado
  }

  try {
    const data = jwt.verify(token, SECRET_JWT_KEY) as any;
    req.session.usuario = data; // { id, nombreUsuario }
    next();
  } catch (error) {
    // Token inválido o expirado - limpiar cookie
    res.clearCookie('token_acceso');
    next();
  }
}

// Middleware para rutas que requieren autenticación
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
	if (!req.session?.usuario) {
  	res.status(401).json({ message: 'Acceso no autorizado' });
		return;
  }
  next();
}

// Middleware para verificar si es admin
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
	if (!req.session?.usuario) {
  	res.status(401).json({ message: 'Acceso no autorizado' });
		return;
  }
  
  // Verificar si el usuario es admin
  if (req.session.usuario.rol !== 'admin') {
    res.status(403).json({ message: 'Se requieren permisos de administrador' });
		return;
  }
  
  next();
}

export async function requireOwnerOrAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  // Verificar sesión y usuario
  if (!req.session || !req.session.usuario) {
    res.status(401).json({ message: 'Acceso no autorizado' });
    return;
  }

  const userId = req.session.usuario.id;
  const userRol = req.session.usuario.rol;
  const equipoId = parseInt(req.params.id, 10);

  // Si es admin, permitir siempre
  if (userRol === 'admin') {
    next();
    return;
  }

  try {
    const em = orm.em.fork();

    // Buscar equipo con su capitán
    const equipo = await em.findOne(Equipo, { id: equipoId }, { populate: ['capitan'] });

    if (!equipo) {
      res.status(404).json({ message: 'Equipo no encontrado' });
      return;
    }

    // Si el usuario es el capitán, permitir
    if (equipo.capitan && equipo.capitan.id === userId) {
      next();
      return;
    }

    // Si no cumple ninguna condición, prohibir acceso
    res.status(403).json({ message: 'No tienes permisos para esta acción' });
  } catch (error) {
    console.error('Error en requireOwnerOrAdmin:', error);
    res.status(500).json({ message: 'Error al verificar permisos' });
  }
}