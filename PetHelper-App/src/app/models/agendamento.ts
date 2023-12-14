import { Cliente } from "./cliente";
import { Pet } from "./pet";
import { Servico } from "./servico";

export interface Agendamento {
  id: number;
  petShopId: number;
  clienteId: number;
  cliente: Cliente;
  servicoId: number;
  servico: Servico;
  petId: number;
  pet: Pet;
  horarioMarcado: string;
  dataAgendamento: Date;
}
