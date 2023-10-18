import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';
import { environment } from 'src/environments/environment';

@Injectable()
export class ClienteService {

  constructor(private http: HttpClient) { }

  private baseURL: string = environment.baseURL + 'Cliente/';

  public async getAllClientes(petShopId: number): Promise<Observable<Cliente[]>> {
    return this.http.get<Cliente[]>(`${this.baseURL}petShopId/${petShopId}`);
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
