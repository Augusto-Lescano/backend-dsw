import express from 'express';
import { usuarioRouter } from './usuario/usuario.routes.js';
const app = express();
app.use(express.json());
app.use('/api/usuarios', usuarioRouter);
app.use((req, res) => {
    res.status(404).send({ message: 'Resource not found' });
});
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000/");
});
//# sourceMappingURL=app.js.map