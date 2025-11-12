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
  getUsuariosSinEquipo,
  getUsuariosAdmin,
  deleteUsuarioAdmin 
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
usuarioRouter.get('/', requireAuth, requireAdmin, findAll);
usuarioRouter.get('/:id', requireAuth, requireAdmin, findOne);
usuarioRouter.delete('/:id', requireAuth, requireAdmin, remove);
usuarioRouter.get('/admin/listado', requireAuth, getUsuariosAdmin);
usuarioRouter.delete('/admin/:id', requireAuth, deleteUsuarioAdmin);
