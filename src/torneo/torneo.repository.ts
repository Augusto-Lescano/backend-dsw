import { Repository } from "../shared/repository.js";
import { Torneo } from "./torneo.entity.js";

const torneos = [
    new Torneo(
        "27c8e78c-8267-4a68-8127-fd673db5deff",
        "Torneo Duelo Quake 3 Arena - Season 2025",
        "Modalidad 1vs1. Mapa: q3dm17. Frag limit: 20. Time limit: 10 mins. Items: Megahealth, Red Armor, Railgun.",
        32,
        "15/11/2023 20:00",
        "20/11/2023 23:59",
        "01/10/2023 00:00",
        "10/11/25 23:59",
        "pendiente",
        "América Latina", 
        "pendiente"
    ),
]

export class TorneoRepository implements Repository<Torneo> {

    public findAll(): Torneo[] | undefined {
        return torneos
    }

    public findOne(item: {id: string;}): Torneo | undefined {
        return torneos.find((torneo) => torneo.id === item.id)
    }

    public add(item: Torneo): Torneo | undefined {
        torneos.push(item)
        return item
    }

    public update(item: Torneo): Torneo | undefined {
        const torneoIdx = torneos.findIndex((torneo) => torneo.id === item.id)

        if(torneoIdx !== -1) {
            torneos[torneoIdx] = {...torneos[torneoIdx], ...item}
        }
        return torneos[torneoIdx]
    }

    public delete(item: {id: string;}): Torneo | undefined {
        const torneoIdx = torneos.findIndex((torneo) => torneo.id === item.id)

        if(torneoIdx !== -1) {
            const deletedTorneos = torneos[torneoIdx]
            torneos.splice(torneoIdx, 1)
            return deletedTorneos
        }
    }
}