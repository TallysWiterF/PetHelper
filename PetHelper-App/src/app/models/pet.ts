export enum RacasEnum {
  Cachorro = 1,
  Gato = 2,
}

export interface Pet {
  id: number;
  petShopId: number;
  clienteId: number;
  nome: string;
  raca: string;
  tipo: RacasEnum;
}
