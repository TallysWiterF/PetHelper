export interface Servico {
  id: number;
  petShopId: number;
  nome: string;
  descricao?: String;
  preco: Number;
  logoServico?: File;
  ativo: boolean;
  dataCriacao?: Date
  dataAtualizacao?: Date;
}
