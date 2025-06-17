import crypto from 'node:crypto';
export class Usuario {
    constructor(id = crypto.randomUUID(), nombre, apellido, email, pais, tag, rol) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.pais = pais;
        this.tag = tag;
        this.rol = rol;
    }
}
//# sourceMappingURL=usuario.entity.js.map