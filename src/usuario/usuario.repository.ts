import { Repository } from "../shared/repository.js";
import { Usuario } from "./usuario.entity.js";

const usuarios = [
    new Usuario(
        'a3170e4f-bcf7-4c25-9a3e-52b8cfa2016c',
        'Lucio',
        'Fernandez',
        'lucia.fernandez98@yahoo.com',
        'Argentina',
        'LuShadow',
        'User'
    ),
]


export class UsuarioRepository implements Repository<Usuario>{
    
    public findAll(): Usuario[] | undefined {
        return usuarios
    }

    public findOne (item: {id:string;}): Usuario | undefined{
        return usuarios.find((usuario) => usuario.id === item.id)
    }

    public add(item: Usuario): Usuario | undefined{
        usuarios.push(item)
        return item
    }

    public update(item: Usuario): Usuario | undefined{
        const usuarioIdx = usuarios.findIndex((usuario)=> usuario.id === item.id)

        if (usuarioIdx != -1){
            usuarios[usuarioIdx] = {...usuarios[usuarioIdx], ...item}
        }
        return usuarios[usuarioIdx]
    }

    public delete (item: {id:string}): Usuario | undefined{
        const usuarioIdx = usuarios.findIndex((usuario)=> usuario.id === item.id)

        if (usuarioIdx != -1){
            const deletedUsuarios = usuarios[usuarioIdx]
            usuarios.splice(usuarioIdx,1)
            return deletedUsuarios
        }
    }
}