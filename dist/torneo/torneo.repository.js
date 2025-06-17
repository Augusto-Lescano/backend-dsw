import { Torneo } from "./torneo.entity.js";
const torneos = [
    new Torneo("27c8e78c-8267-4a68-8127-fd673db5deff", "Torneo Duelo Quake 3 Arena - Season 2025", "Modalidad 1vs1. Mapa: q3dm17. Frag limit: 20. Time limit: 10 mins. Items: Megahealth, Red Armor, Railgun.", 32, "15/11/2023 20:00", "20/11/2023 23:59", "01/10/2023 00:00", "10/11/25 23:59", "pendiente", "América Latina", "pendiente"),
];
export class TorneoRepository {
    findAll() {
        return torneos;
    }
    findOne(item) {
        return torneos.find((torneo) => torneo.id === item.id);
    }
    add(item) {
        torneos.push(item);
        return item;
    }
    update(item) {
        const torneoIdx = torneos.findIndex((torneo) => torneo.id === item.id);
        if (torneoIdx !== -1) {
            torneos[torneoIdx] = { ...torneos[torneoIdx], ...item };
        }
        return torneos[torneoIdx];
    }
    delete(item) {
        const torneoIdx = torneos.findIndex((torneo) => torneo.id === item.id);
        if (torneoIdx !== -1) {
            const deletedTorneos = torneos[torneoIdx];
            torneos.splice(torneoIdx, 1);
            return deletedTorneos;
        }
    }
}
//# sourceMappingURL=torneo.repository.js.map