import { Router } from "express"; 
import { 
  findAll, 
  findOne, 
  sanitizeUsuarioInput,
  validateUsuarioCreate,
  validateUsuarioUpdate,
  update, 
  remove, 
  login, 
  logout, 
  register, 
  protegida,
  getUsuariosSinEquipo 
} from "./usuario.controller.js"; 
import { requireAuth, requireAdmin, requireOwnerOrAdmin } from "../shared/middleware/auth.middleware.js";

export const usuarioRouter = Router();

// Rutas públicas
usuarioRouter.post('/login', login);
usuarioRouter.post('/register', validateUsuarioCreate, sanitizeUsuarioInput, register);
usuarioRouter.post('/logout', logout);

// Rutas protegidas para usuarios autenticados
usuarioRouter.get('/ruta/protegida', requireAuth, protegida);
usuarioRouter.get('/sin-equipo', requireAuth, getUsuariosSinEquipo);

// Rutas de perfil (usuario autenticado puede editar su propio perfil)
usuarioRouter.put('/:id', requireAuth, requireOwnerOrAdmin, validateUsuarioUpdate, sanitizeUsuarioInput, update);
usuarioRouter.patch('/:id', requireAuth, requireOwnerOrAdmin, validateUsuarioUpdate, sanitizeUsuarioInput, update);

// Rutas de administración (SOLO ADMINS)
usuarioRouter.get('/', requireAuth, requireAdmin, findAll); //Listar usuarios
usuarioRouter.get('/:id', requireAuth, requireAdmin, findOne); //Buscar usuario específico
usuarioRouter.delete('/:id', requireAuth, requireAdmin, remove); // Eliminar usuario


/*
POST /api/usuarios/login           # Iniciar sesión (Público)
POST /api/usuarios/register        # Registrarse como nuevo usuario (Público)
GET  /api/usuarios/ruta/protegida  # Acceder a contenido protegido (logueado)
POST /api/usuarios/logout          # Cerrar sesión (logueado)
PUT  /api/usuarios/15              # Actualizar MI perfil (si soy usuario 15) (logueado)
PATCH /api/usuarios/15             # Actualizar parcialmente MI perfil (logueado)
GET  /api/usuarios                 # Listar TODOS los usuarios (admin)
GET  /api/usuarios/8               # Ver perfil específico del usuario 8 (admin)
GET  /api/usuarios/12              # Ver perfil específico del usuario 12 (admin)
DELETE /api/usuarios/8             # Eliminar usuario 8 (admin)
DELETE /api/usuarios/12            # Eliminar usuario 12 (admin)
*/