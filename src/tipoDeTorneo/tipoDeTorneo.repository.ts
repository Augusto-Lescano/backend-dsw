import { TipoDeTorneo } from "./tipoDeTorneo.entity.js";
import { Repository } from "../shared/repository.js";


const tiposDeTorneo: TipoDeTorneo[] = [
  new TipoDeTorneo(
  "Battle Royale",
  "100 jugadores se enfrentan, donde solo uno queda en pie",
  )
]


export class TipoDeTorneoRepository implements Repository<TipoDeTorneo>{
  findAll(): TipoDeTorneo[] | undefined {
  return tiposDeTorneo
  }
  findOne(item: { id: string; }): TipoDeTorneo | undefined {
    const tipo = tiposDeTorneo.find(tip => tip.id === item.id)
    return tipo }
  add(item: TipoDeTorneo): TipoDeTorneo | undefined { 
    tiposDeTorneo.push(item)
    return item
  }
  update(item: TipoDeTorneo): TipoDeTorneo | undefined {
    const indice = tiposDeTorneo.findIndex(tip => tip.id === item.id)
  if(indice!==-1){
    tiposDeTorneo[indice]={...tiposDeTorneo[indice], ...item}
    return tiposDeTorneo[indice]
    }else{
      tiposDeTorneo[indice]
    }
  }
  delete(item: { id: string; }): TipoDeTorneo | undefined {
    const indice = tiposDeTorneo.findIndex(tip => tip.id === item.id)
    if(indice!==-1){
      const tipoBorrado = tiposDeTorneo[indice]
      tiposDeTorneo.splice(indice, 1)
      return tipoBorrado
  }else{
    return tiposDeTorneo[indice]
  }
 }
}
