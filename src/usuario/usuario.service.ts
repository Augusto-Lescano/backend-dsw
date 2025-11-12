// usuario.service.ts
import { orm } from '../shared/db/orm.js';
import { Usuario } from './usuario.entity.js';
import { Equipo } from '../equipo/equipo.entity.js';
import { Torneo } from '../torneo/torneo.entity.js'; 
import bcrypt from 'bcrypt';

export class UsuarioService {
  
	// ==== CREAR USUARIO ====
	// Para creación - todos los campos son requeridos
  static async createUser(userData: {
    nombre: string;
    apellido: string;
    email: string;
    nombreUsuario: string;
    contrasenia: string;
    pais: string;
    rol?: string;
  }) {
    const em = orm.em;

		// Forzar rol 'user' para registros normales
    const userDataWithRole = {
      ...userData,
      rol: 'user' // Siempre será 'user' para registros normales
    };

    // Verificar si el email ya existe
    const existingUser = await em.findOne(Usuario, { email: userData.email });
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Verificar si el nombre de usuario ya existe
    const existingUsername = await em.findOne(Usuario, { nombreUsuario: userData.nombreUsuario });
    if (existingUsername) {
      throw new Error('El nombre de usuario ya está en uso');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(userData.contrasenia, 10);

    // Crear el usuario con la contraseña hasheada
    const usuario = em.create(Usuario, {
      ...userDataWithRole,
      contrasenia: hashedPassword // Guardar la contraseña hasheada
    });
    
    await em.persistAndFlush(usuario);
    
    // Excluir contraseña en la respuesta
    const { contrasenia: _, ...usuarioPublico } = usuario;
    return usuarioPublico;
  }


	// ==== ACTUALIZAR USUARIO ====
	// Para actualización - campos parciales
  static async updateUser(id: number, updateData: {
    nombre?: string;
    apellido?: string;
    email?: string;
    nombreUsuario?: string;
    contrasenia?: string;
    pais?: string;
    rol?: string;
  }) {
    const em = orm.em;
    
		// Busca el usuario a modificar
    const usuario = await em.findOne(Usuario, { id });
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

		// Verificar si el nuevo email ya existe (excluyendo el usuario actual)
    if (updateData.email) {
      const existingEmail = await em.findOne(Usuario, { 
        email: updateData.email,
        id: { $ne: id }
      });
      if (existingEmail) {
        throw new Error('El email ya está registrado');
      }
    }

    // Verificar si el nuevo nombre de usuario ya existe (excluyendo el usuario actual)
    if (updateData.nombreUsuario) {
      const existingUsername = await em.findOne(Usuario, { 
        nombreUsuario: updateData.nombreUsuario,
        id: { $ne: id }
      });
      if (existingUsername) {
        throw new Error('El nombre de usuario ya está en uso');
      }
    }

    // Si se proporciona nueva contraseña, hashearla
    if (updateData.contrasenia) {
      updateData.contrasenia = await bcrypt.hash(updateData.contrasenia, 10);
    }

    // Actualizar solo los campos proporcionados
    em.assign(usuario, updateData);
    await em.flush();
    
    // Excluir contraseña en la respuesta
    const { contrasenia: _, ...usuarioPublico } = usuario;
    return usuarioPublico;
  }

	// ==== INGRESO DE USUARIO ====
  static async login(identifier: string, contrasenia: string) {
    const em = orm.em;
    
    // Buscar usuario por email O por nombre de usuario
    const usuario = await em.findOne(Usuario, {
        $or: [
            { email: identifier },
            { nombreUsuario: identifier }
        ]
    });
    
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }
    
    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(contrasenia, usuario.contrasenia);
    if (!isPasswordValid) {
        throw new Error('Contraseña incorrecta');
    }

		const { contrasenia: _, ...usuarioPublico } = usuario; //Excluye la contraseña, es decir, no la devuelve
    
    return usuarioPublico;
	}

  // ==== BUSCAR USUARIO POR ID ====
  static async findOne(id: number) {
    const em = orm.em;
    const usuario = await em.findOne(Usuario, { id });
    
    if (usuario) {
      const { contrasenia: _, ...usuarioPublico } = usuario;
      return usuarioPublico;
    }
    return null;
  }

  // ==== LISTAR TODOS LOS USUARIOS ====
  static async findAll() {
    const em = orm.em;
    const usuarios = await em.find(Usuario, {});
    
    // Excluir contraseñas de todos los usuarios
    return usuarios.map(usuario => {
      const { contrasenia, ...usuarioPublico } = usuario;
      return usuarioPublico;
    });
  }

	// ==== ELIMINAR USUARIO (SOLO ADMIN) ====
  static async deleteUser(id: number) {
    const em = orm.em;
    
    const usuario = await em.findOne(Usuario, { id });
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar que no sea el último admin (seguridad)
    if (usuario.rol === 'admin') {
      const adminCount = await em.count(Usuario, { rol: 'admin' });
      if (adminCount <= 1) {
        throw new Error('No se puede eliminar el único administrador del sistema');
      }
    }

    await em.removeAndFlush(usuario);
    
    return { message: 'Usuario eliminado exitosamente' };
  }

  // ==== CREAR ADMIN MANUALMENTE (para uso interno) ====
  static async createAdmin(adminData: {
    nombre: string;
    apellido: string;
    email: string;
    nombreUsuario: string;
    contrasenia: string;
    pais: string;
  }) {
    const em = orm.em;

    // Verificar si el email ya existe
    const existingUser = await em.findOne(Usuario, { email: adminData.email });
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Verificar si el nombre de usuario ya existe
    const existingUsername = await em.findOne(Usuario, { nombreUsuario: adminData.nombreUsuario });
    if (existingUsername) {
      throw new Error('El nombre de usuario ya está en uso');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(adminData.contrasenia, 10);

    // Crear el usuario con rol 'admin'
    const admin = em.create(Usuario, {
      ...adminData,
      contrasenia: hashedPassword,
      rol: 'admin' // Rol específico para admin
    });
    
    await em.persistAndFlush(admin);
    
    // Excluir contraseña en la respuesta
    const { contrasenia: _, ...adminPublico } = admin;
    return adminPublico;
  }

  static async obtenerUsuariosSinEquipo() {
    const em = orm.em.fork();

    const qb = em.createQueryBuilder(Usuario, 'u');
    qb.select(['u.id', 'u.nombre'])
      .leftJoin('u.equipos', 'e')
      .where('e.id is null');

    return await qb.getResultList();
  }

   // ==== LISTADO DETALLADO PARA ADMIN ====
  static async getUsuariosAdmin() {
    const em = orm.em.fork();

    const usuarios = await em.find(
      Usuario,
      {},
      {
        populate: [
          'equipos',          // donde es miembro
          'equiposCapitan',   // donde es capitán
          'torneosCreados',   // torneos creados
        ],
        orderBy: { nombre: 'ASC' },
      }
    );

    // Transformar los datos antes de devolverlos
    return usuarios.map(u => ({
      id: u.id,
      nombre: u.nombre,
      apellido: u.apellido,
      email: u.email,
      nombreUsuario: u.nombreUsuario,
      pais: u.pais,
      rol: u.rol,
      equiposMiembro: u.equipos?.getItems().map(e => e.nombre) ?? [],
      equiposCapitan: u.equiposCapitan?.getItems().map(e => e.nombre) ?? [],
      torneosCreados: u.torneosCreados?.getItems().map(t => t.nombre) ?? [],
    }));
  }
}