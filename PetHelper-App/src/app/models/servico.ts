export interface Servico {
  id: number;
  petShopId: number;
  nome: string;
  descricao: String;
  preco: number;
  logoServico?: string;
  ativo: boolean;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}
