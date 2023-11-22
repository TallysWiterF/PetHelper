import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Agendamento } from '../models/agendamento';
import { Observable } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Informativo } from '../models/informativo';
import { AutenticacaoService } from './autenticacao.service';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {

  constructor(private http: HttpClient,
    private autenticacaoService: AutenticacaoService) {
    this.configureHubConnection();
  }

  private hubConnection?: HubConnection;
  private baseURL: string = environment.baseURL + 'Agendamento/';
  private petShopId = this.autenticacaoService.getPetShopId;

  private configureHubConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.hubURL)
      .build();

    this.hubConnection.start()
      .then(() => {

      })
      .catch((error: any) => {

      });

    this.hubConnection.on('NovoAgendamentoCadastrado', () => {
      this.metodoCalendario.emit();
    });
  }

  public metodoCalendario: EventEmitter<void> = new EventEmitter<void>();

  public async getAllAgendamentos(dataAgendamento: Date): Promise<Observable<Agendamento[]>> {
    return this.http.get<Agendamento[]>(`${this.baseURL}petShopId/${this.petShopId}/dataAgendamento/${dataAgendamento}`);
  }

  public async getAllDiasComAgendamentos(mes: number): Promise<Observable<number[]>> {
    return this.http.get<number[]>(`${this.baseURL}petShopId/${this.petShopId}/mes/${mes}`);
  }

  public async getHorariosDisponiveis(dataSelecionada: Date): Promise<Observable<string[]>> {
    return this.http.get<string[]>(`${this.baseURL}petShopId/${this.petShopId}/${dataSelecionada}`);
  }

  public async getInformativos(dataAgendamento: Date): Promise<Observable<Informativo>> {
    return this.http.get<Informativo>(`${this.baseURL}informativos/${this.petShopId}/${dataAgendamento}`);
  }

  public async adicionarAgendamento(agendamento: Agendamento): Promise<Observable<Agendamento>> {
    return this.http.post<Agendamento>(this.baseURL, agendamento);
  }

  public async editarAgendamento(agendamento: Agendamento): Promise<Observable<Agendamento>> {
    return this.http.put<Agendamento>(this.baseURL, agendamento);
  }

  public async deletarAgendamento(agendamentoId: number): Promise<Observable<string>> {
    return this.http.delete<string>(`${this.baseURL}${agendamentoId}`);
  }
}
