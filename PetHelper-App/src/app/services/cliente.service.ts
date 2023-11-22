import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';
import { environment } from 'src/environments/environment';
import { AutenticacaoService } from './autenticacao.service';

@Injectable()
export class ClienteService {


  constructor(private http: HttpClient,
              private autenticacaoService: AutenticacaoService) { }

  private baseURL: string = environment.baseURL + 'Cliente/';
  private petShopId = this.autenticacaoService.getPetShopId;

  public async getAllClientes(): Promise<Observable<Cliente[]>> {
    return this.http.get<Cliente[]>(`${this.baseURL}petShopId/${this.petShopId}`);
  }

  public async getClienteByPetShopIdTelefone(petshopId: number, telefone: string): Promise<Observable<Cliente>> {
    return this.http.get<Cliente>(`${this.baseURL}petShopId/${petshopId}/${telefone}`);
  }

  public async adicionarCliente(cliente: Cliente): Promise<Observable<Cliente>> {
    return this.http.post<Cliente>(this.baseURL, cliente);
  }

  public async editarCliente(cliente: Cliente): Promise<Observable<Cliente>> {
    return this.http.put<Cliente>(this.baseURL, cliente);
  }

  public async deletarCliente(clienteId: number): Promise<Observable<string>> {
    return this.http.delete<string>(`${this.baseURL}${clienteId}`);
  }
}
