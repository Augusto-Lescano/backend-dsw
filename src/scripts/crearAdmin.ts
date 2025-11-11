import { orm } from "../shared/db/orm.js";
import { Usuario } from "../usuario/usuario.entity.js";
import bcrypt from 'bcrypt';

async function createAdmins() {
  const em = orm.em.fork();
  
  try {
    console.log('Creando administradores...');

    const admins = [
      {
        nombre: 'Gian Marco',
        apellido: 'Mercanzini',
        email: 'gianmarco@torneos.com',
        nombreUsuario: 'gianmarco',
        contrasenia: 'gianmarco123',
        pais: 'Argentina'
      },
      {
        nombre: 'Emilio',
        apellido: 'Certo', 
        email: 'emicerto@torneos.com',
        nombreUsuario: 'emicerto',
        contrasenia: 'emicerto123',
        pais: 'Argentina'
      },
      {
        nombre: 'Augusto',
        apellido: 'Lescano',
        email: 'auguslescano@torneos.com',
        nombreUsuario: 'augus',
        contrasenia: 'augusto123',
        pais: 'Argentina'
      }
    ];

    for (const adminData of admins) {
      try {
        // Verificar si ya existe
        const existing = await em.findOne(Usuario, { 
          $or: [
            { email: adminData.email },
            { nombreUsuario: adminData.nombreUsuario }
          ]
        });

        if (existing) {
          console.log(`ℹAdmin ya existe: ${adminData.email}`);
          continue;
        }

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(adminData.contrasenia, 10);

        // Crear admin
        const admin = em.create(Usuario, {
          ...adminData,
          contrasenia: hashedPassword,
          rol: 'admin'
        });

        await em.persistAndFlush(admin);
        console.log(`Admin creado: ${adminData.email}`);
        
      } catch (error: any) {
        console.log(`Error con ${adminData.email}:`, error.message);
      }
    }

    console.log('Proceso completado!');
    
  } catch (error: any) {
    console.error('Error general:', error.message);
  } finally {
    await orm.close();
  }
}

createAdmins();