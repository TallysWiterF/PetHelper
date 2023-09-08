import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';

@Injectable()
export class ClienteService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'https://localhost:7233/api/Clientes';

  public getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.baseURL);
  }

}
