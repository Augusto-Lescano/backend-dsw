import {NextFunction, Request, Response} from 'express' 
import { UsuarioService } from './usuario.service.js';
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '../../config.js';


// Middleware de validación para creación (register)
export function validateUsuarioCreate(req: Request, res: Response, next: NextFunction):
void {
	const errors: string[] = [];

  // Validar campos requeridos (sin rol, se asigna automáticamente)
  const requiredFields = ['nombre', 'apellido', 'email', 'nombreUsuario', 'contrasenia', 'pais'];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    errors.push(`Faltan campos requeridos: ${missingFields.join(', ')}`);
  }

  // Validar que todos los campos sean strings
  const stringFields = ['nombre', 'apellido', 'email', 'nombreUsuario', 'contrasenia', 'pais'];
  const nonStringFields = stringFields.filter(field => typeof req.body[field] !== 'string');
  
  if (nonStringFields.length > 0) {
    errors.push(`Los siguientes campos deben ser texto: ${nonStringFields.join(', ')}`);
  }
  
  // Validaciones específicas por campo (solo si son strings)
  if (typeof req.body.nombre === 'string' && req.body.nombre.length < 3) {
    errors.push('El nombre debe contener al menos 3 caracteres');
  }

	if (typeof req.body.apellido === 'string' && req.body.apellido.length < 4) {
    errors.push('El apellido debe contener al menos 4 caracteres')
  }

	// Validación de email con expresión regular
  if (typeof req.body.email === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      errors.push('El formato del email es inválido');
    }
  }

	if (typeof req.body.nombreUsuario === 'string' && req.body.nombreUsuario.length < 6) {
    errors.push('El nombre de usuario debe contener al menos 6 caracteres');
  }

  if (typeof req.body.contrasenia === 'string' && req.body.contrasenia.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }

  if (typeof req.body.pais === 'string' && req.body.pais.length < 4) {
    errors.push('El país debe contener al menos 4 caracteres');
  }

 	// Si viene rol, ignorarlo (se asigna automáticamente como 'user')
  if (req.body.rol) {
    delete req.body.rol;
  }

	// Si hay errores, retornarlos todos juntos
  if (errors.length > 0) {
    res.status(400).json({
      message: 'Errores de validación',
      errors: errors
    });
    return;
  }

  next();
}


// Middleware de validación para actualización
export function validateUsuarioUpdate(req: Request, res: Response, next: NextFunction): void {
  const errors: string[] = [];

  // Validar que al menos un campo venga para actualizar
  const updateFields = ['nombre', 'apellido', 'email', 'nombreUsuario', 'contrasenia', 'pais'];
  const hasFieldsToUpdate = updateFields.some(field => req.body[field] !== undefined);
  
  if (!hasFieldsToUpdate) {
    errors.push('Debe proporcionar al menos un campo para actualizar');
  }

  // Validar que los campos que vengan sean strings
  const providedFields = Object.keys(req.body).filter(field => req.body[field] !== undefined);
  const nonStringFields = providedFields.filter(field => 
    updateFields.includes(field) && typeof req.body[field] !== 'string'
  );
  
  if (nonStringFields.length > 0) {
    errors.push(`Los siguientes campos deben ser texto: ${nonStringFields.join(', ')}`);
  }

  // Validaciones específicas por campo (solo si vienen y son strings)
  if (typeof req.body.nombre === 'string' && req.body.nombre.length < 3) {
    errors.push('El nombre debe contener al menos 3 caracteres');
  }

  if (typeof req.body.apellido === 'string' && req.body.apellido.length < 4) {
    errors.push('El apellido debe contener al menos 4 caracteres');
  }

  // Validación de email con expresión regular (solo si viene)
  if (typeof req.body.email === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      errors.push('El formato del email es inválido');
    }
  }

  if (typeof req.body.nombreUsuario === 'string' && req.body.nombreUsuario.length < 6) {
    errors.push('El nombre de usuario debe contener al menos 6 caracteres');
  }

  if (typeof req.body.contrasenia === 'string' && req.body.contrasenia.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }

  if (typeof req.body.pais === 'string' && req.body.pais.length < 4) {
    errors.push('El país debe contener al menos 4 caracteres');
  }

  // Si viene rol, no permitir que usuarios normales lo cambien
  if (req.body.rol && req.session?.usuario?.rol !== 'admin') {
    delete req.body.rol; // Solo admins pueden cambiar el rol
  }

  // Si hay errores, retornarlos todos juntos
  if (errors.length > 0) {
    res.status(400).json({
      message: 'Errores de validación',
      errors: errors
    });
    return;
  }

  next();
}


// Asegura que solo los campos necesarios lleguen al controlador. Previene ataques de sobrecarga de datos
export function sanitizeUsuarioInput(req: Request, res: Response, next: NextFunction): void {
  req.body.sanitizedInput = { 
    nombre: req.body.nombre, 
    apellido: req.body.apellido, 
    email: req.body.email, 
    pais: req.body.pais, 
    nombreUsuario: req.body.nombreUsuario,
    contrasenia: req.body.contrasenia,
    rol: req.body.rol, 
  } 

  // Eliminar campos undefined (útil para actualizaciones)
  Object.keys(req.body.sanitizedInput).forEach(key => { 
    if (req.body.sanitizedInput[key] === undefined) { 
      delete req.body.sanitizedInput[key] 
    }  
  }) 
  
  next();
}


// Autenticación
export const register = async (req: Request, res: Response) => {
  try {
    // Para creación, esperamos todos los campos
    const userData = req.body.sanitizedInput;
    const usuario = await UsuarioService.createUser(userData);
    
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      data: usuario
    });
  } catch (error) {
    // No es buena idea mandar el error del service. Puede traer info sensible
    res.status(400).json({
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, contrasenia } = req.body; //Recibir email/nombreUsuario y contraseña

    const usuario = await UsuarioService.login(identifier, contrasenia);
		const token = jwt.sign({ id: usuario.id, nombreUsuario: usuario.nombreUsuario, rol: usuario.rol}, SECRET_JWT_KEY,
			{
				expiresIn: '1h'
			})
		// NO SE ALMACENA EN EL LOCALSTORAGE NI EN SESSIONSTORAGE, SE ALMACENA EN COOKIES
    res
		.cookie('token_acceso', token, {
			httpOnly: true, // La cookie solo se puede acceder en el servidor, no desde javascript. (document.cookie no funciona)
			secure: process.env.NODE_ENV === 'production', // La cookie solo se puede acceder en https
			sameSite: 'strict', // La cookie solo se puede acceder en el mismo dominio
			maxAge: 1000 * 60 * 60 // La cookie tiene un tiempo de validez de 1 hora
		})
		.status(200).json({
      message: 'Login exitoso',
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        nombreUsuario: usuario.nombreUsuario,
				rol: usuario.rol
        // No devolver la contraseña
      }
    });
  } catch (error) {
    res.status(401).json({
      message: error instanceof Error ? error.message : 'Error en el login'
    });
  }
};


export const protegida = async (req: Request, res: Response): Promise<void> => {
  const usuario = req.session?.usuario;

  if (!usuario) {
    res.status(401).json({ message: 'No autorizado' });
    return; // solo cortar la ejecución
  }

  res.status(200).json({ message: 'Acceso autorizado', data: usuario });
};


export const logout = async (req: Request, res: Response) => {
  res
    .clearCookie('token_acceso', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    .status(200)
    .json({ message: 'Sesión cerrada con éxito' });
};


export const findAll = async (req: Request, res: Response) => { 
  try { 
    const usuarios = await UsuarioService.findAll();
    res.status(200).json({
      message: 'Listado de usuarios obtenido exitosamente',
      data: usuarios 
    });
  } catch(error: any) { 
    res.status(500).json({ message: error.message }) 
  }
}


export const findOne = async (req: Request, res: Response) => { 
  try { 
    const id = Number.parseInt(req.params.id);
    const usuario = await UsuarioService.findOne(id);
    
    if (!usuario) {
    	res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      message: 'Usuario encontrado exitosamente',
      data: usuario 
    });
  } catch(error: any) { 
    res.status(500).json({ message: error.message }) 
  }
}


export const remove = async (req: Request, res: Response) => { 
  try { 
    const id = Number.parseInt(req.params.id);
    
    // Verificar que el admin no se elimine a sí mismo
    if (req.session?.usuario?.id === id) {
    	res.status(400).json({ 
      message: 'No puedes eliminarte a ti mismo' 
      });
    }

    await UsuarioService.deleteUser(id);
    
    res.status(200).json({ 
      message: 'Usuario eliminado exitosamente'
    });
  } catch(error: any) { 
    if (error.message.includes('no encontrado')) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  } 
}


export const update = async (req: Request, res: Response) => {
  try {
    // Para actualización, pueden venir campos parciales
    const id = parseInt(req.params.id);
    const updateData = req.body.sanitizedInput;
    
    const usuario = await UsuarioService.updateUser(id, updateData);
    
    res.status(200).json({
      message: 'Perfil actualizado exitosamente',
      data: usuario
    });
  }
	catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : 'Error al actualizar'
    });
	}
}


export const getUsuariosSinEquipo = async (req: Request, res: Response) => {
  try {
    const usuarios = await UsuarioService.obtenerUsuariosSinEquipo();
    res.status(200).json({ data: usuarios });
  } catch (error) {
    console.error('Error obteniendo usuarios sin equipo:', error);
    res.status(500).json({ message: 'Error obteniendo usuarios sin equipo' });
  }
}


// Lista detallada de usuarios (solo admin)
export async function getUsuariosAdmin(req: Request, res: Response) {
  try {
    const usuario = req.session?.usuario;

    if (!usuario || usuario.rol !== 'admin') {
      res.status(403).json({ message: 'Se requieren permisos de administrador' });
      return;
    }

    const usuarios = await UsuarioService.getUsuariosAdmin();

    res.status(200).json({
      message: 'Listado de usuarios (admin)',
      data: usuarios,
    });
  } catch (error: any) {
    console.error('Error en getUsuariosAdmin:', error);
    res.status(500).json({ message: error.message });
  }
}

// Eliminar usuario (solo admin)
export async function deleteUsuarioAdmin(req: Request, res: Response) {
  try {
    const usuarioSesion = req.session?.usuario;

    if (!usuarioSesion || usuarioSesion.rol !== 'admin') {
      res.status(403).json({ message: 'Se requieren permisos de administrador' });
      return;
    }

    const id = Number.parseInt(req.params.id);
    const result = await UsuarioService.deleteUser(id);

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error en deleteUsuarioAdmin:', error);
    res.status(500).json({ message: error.message });
  }
}