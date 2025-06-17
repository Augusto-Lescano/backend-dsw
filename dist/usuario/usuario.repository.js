import { Usuario } from "./usuario.entity.js";
const usuarios = [
    new Usuario('a3170e4f-bcf7-4c25-9a3e-52b8cfa2016c', 'Lucio', 'Fernandez', 'lucio.fernandez98@yahoo.com', 'Argentina', 'LuShadow', 'User'),
];
export class UsuarioRepository {
    findAll() {
        return usuarios;
    }
    findOne(item) {
        return usuarios.find((usuario) => usuario.id === item.id);
    }
    add(item) {
        usuarios.push(item);
        return item;
    }
    update(item) {
        const usuarioIdx = usuarios.findIndex((usuario) => usuario.id === item.id);
        if (usuarioIdx != -1) {
            usuarios[usuarioIdx] = { ...usuarios[usuarioIdx], ...item };
        }
        return usuarios[usuarioIdx];
    }
    delete(item) {
        const usuarioIdx = usuarios.findIndex((usuario) => usuario.id === item.id);
        if (usuarioIdx != -1) {
            const deletedUsuarios = usuarios[usuarioIdx];
            usuarios.splice(usuarioIdx, 1);
            return deletedUsuarios;
        }
    }
}
//# sourceMappingURL=usuario.repository.js.map