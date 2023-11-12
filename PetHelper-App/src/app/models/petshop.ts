export interface PetShop {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  senha: string;
  endereco: string;
  fotoPrincipal?: string;
  logo?: string
  ativo: boolean;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}
