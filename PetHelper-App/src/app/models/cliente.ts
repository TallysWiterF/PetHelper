export interface Cliente {
  id: number;
  petShopId: number;
  nome: string;
  telefone: string;
  endereco: string;
  complemento: string;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}
