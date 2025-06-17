import { TorneoRepository } from "./torneo.repository.js";
import { Torneo } from "./torneo.entity.js";
const repository = new TorneoRepository();
function sanitizeTorneoInput(req, res, next) {
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        descripcionReglas: req.body.descripcionReglas,
        cantidadJugadores: req.body.cantidadJugadores,
        fechaInicio: req.body.fechaInicio,
        fechaFin: req.body.fechaFin,
        fechaInicioIns: req.body.fechaInicioIns,
        fechaFinIns: req.body.fechaFinIns,
        resultado: req.body.resultado,
        region: req.body.region,
        estado: req.body.estado
    };
    //Más validaciones acá
    Object.keys(req.body.sanitizedInput).forEach(key => {
        if (req.body.sanitizedInput[key] === undefined)
            delete req.body.sanitizedInput[key];
    });
    next();
}
function findAll(req, res) {
    res.json({ data: repository.findAll() });
}
function findOne(req, res) {
    const torneo = repository.findOne({ id: req.params.id });
    if (!torneo) {
        res.status(404).send({ message: 'torneo not found' });
    }
    else {
        res.json({ data: torneo });
    }
}
function add(req, res) {
    const input = req.body.sanitizedInput;
    const torneoInput = new Torneo(undefined, input.nombre, input.descripcionReglas, input.cantidadJugadores, input.fechaInicio, input.fechaFin, input.fechaInicioIns, input.fechaFinIns, input.resultado, input.region, input.estado);
    const character = repository.add(torneoInput);
    res.status(201).send({ message: 'Torneo created', data: character });
}
function update(req, res) {
    req.body.sanitizedInput.id = req.params.id;
    const torneo = repository.update(req.body.sanitizedInput);
    if (!torneo) {
        res.status(404).send({ message: 'Torneo not found' });
    }
    res.status(200).send({ message: 'Torneo updated successfully', data: torneo });
}
function remove(req, res) {
    const id = req.params.id;
    const torneo = repository.delete({ id });
    if (!torneo) {
        res.status(404).send({ message: 'Torneo not found' });
    }
    else {
        res.status(200).send({ message: 'Torneo deleted successfully' });
    }
}
export { sanitizeTorneoInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=torneo.controller.js.map