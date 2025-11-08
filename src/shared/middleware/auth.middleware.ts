import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '../../../config.js';

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

// Middleware para verificar si es el propietario del recurso o admin
export function requireOwnerOrAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.session?.usuario) {
    res.status(401).json({ message: 'Acceso no autorizado' });
		return;
  }
  
  const userId = req.session.usuario.id;
  const resourceId = parseInt(req.params.id);
  
  // Si es admin, permitir siempre
  if (req.session.usuario.rol === 'admin') {
    return next();
  }
  
  // Si es el propietario del recurso, permitir
  if (userId === resourceId) {
    return next();
  }
  
  res.status(403).json({ message: 'No tienes permisos para esta acción' });
	return;
}