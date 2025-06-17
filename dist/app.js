import express from 'express';
import { Usuario } from './usuario/usuario.entity.js';
import { UsuarioRepository } from './usuario/usuario.repository.js';
const app = express();
app.use(express.json());
function sanitizeUsuarioInput(req, res, next) {
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        pais: req.body.pais,
        tag: req.body.tag,
        rol: req.body.rol,
    };
    next();
}
const repository = new UsuarioRepository;
app.get('/api/usuarios', (req, res) => {
    res.json({ data: repository.findAll() });
});
app.get('/api/usuarios/:id', (req, res) => {
    const usuario = repository.findOne({ id: req.params.id });
    if (!usuario) {
        return res.status(404).send({ message: 'Usuario not found' });
    }
    res.json({ data: usuario });
});
app.post('/api/usuarios', sanitizeUsuarioInput, (req, res) => {
    const input = req.body.sanitizedInput;
    const usuarioInput = new Usuario(input.nombre, input.apellido, input.email, input.pais, input.tag, input.rol);
    const usuario = repository.add(usuarioInput);
    return res.status(201).send({ message: 'Usuario created', data: usuario });
});
app.put('/api/usuarios/:id', sanitizeUsuarioInput, (req, res) => {
    req.body.sanitizedInput.id = req.params.id;
    const usuario = repository.update(req.body.sanitizedInput);
    if (!usuario) {
        return res.status(404).send({ message: 'Usuario not found' });
    }
    return res.status(200).send({ message: 'Usuario update successfully', data: usuario });
});
app.patch('/api/usuarios/:id', sanitizeUsuarioInput, (req, res) => {
    req.body.sanitizedInput.id = req.params.id;
    const usuario = repository.update(req.body.sanitizedInput);
    if (!usuario) {
        return res.status(404).send({ message: 'Usuario not found' });
    }
    return res.status(200).send({ message: 'Usuario update successfully', data: usuario });
});
app.delete('/api/usuarios/:id', (req, res) => {
    const id = req.params.id;
    const usuario = repository.delete({ id });
    if (!usuario) {
        res.status(404).send({ message: 'Usuario not found' });
    }
    else {
        res.status(200).send({ message: 'Usuario deleted successfully' });
    }
});
app.use('/', (req, res) => {
    res.status(404).send({ message: 'Resource not found' });
});
app.listen(3000, () => {
    console.log('Server running in http://localhost:3000/');
});
//# sourceMappingURL=app.js.map