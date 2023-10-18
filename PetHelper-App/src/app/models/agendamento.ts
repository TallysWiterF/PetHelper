import { Cliente } from "./cliente";
import { Servico } from "./servico";

export interface Agendamento {
  id: number;
  petShopId: number;
  clienteId: number;
  cliente: Cliente;
  servicoId: number;
  servico: Servico;
  horarioMarcado: string;
  dataAgendamento: Date;
}
