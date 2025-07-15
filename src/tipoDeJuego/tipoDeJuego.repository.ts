import { Repository} from "../shared/repository.js"; 
import { TipoDeJuego } from "./tipoDeJuego.entity.js";

const tipos = [
  new TipoDeJuego(
    "Accion",
    "Juegos que tienen mucha accion"
  )
]

export class TipoDeJuegoRepository implements Repository<TipoDeJuego>{
  findAll(): TipoDeJuego[] | undefined {
    return tipos
  }
  findOne(item: { id: string; }): TipoDeJuego | undefined {
    const tipoDeJuego = tipos.find(tip=>tip.id===item.id)
    return tipoDeJuego
  }
  add(item: TipoDeJuego): TipoDeJuego | undefined {
    tipos.push(item)
    return item
  }
  update(item: TipoDeJuego): TipoDeJuego | undefined {
    const indice = tipos.findIndex(tip=>tip.id===item.id)
    if(indice!==-1){
      tipos[indice]={...tipos[indice],...item}
      return tipos[indice]
    }else{
      return tipos[indice]
    }
  }
  delete(item: { id: string; }): TipoDeJuego | undefined {
    const indice = tipos.findIndex(tip=>tip.id===item.id)
    const tipoBorrar=tipos[indice]
    if(indice!==-1){
      tipos.splice(indice,1)
      return tipoBorrar
    }else{
      return tipoBorrar
    }
  }

}
