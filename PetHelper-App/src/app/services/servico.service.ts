import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servico } from '../models/servico';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {

  constructor(private http: HttpClient) { }

  private baseURL: string = environment.baseURL + "Servico/";

  public getAllServicos(petShopId: number): Observable<Servico[]> {
    return this.http.get<Servico[]>(this.baseURL + "petShopId/" + petShopId);
  }

  public adicionarServico(servico: Servico): Observable<Servico> {
    return this.http.post<Servico>(this.baseURL, servico);
  }

  public async editarServico(servico: Servico): Promise<Observable<Servico>>{
    return this.http.put<Servico>(this.baseURL, servico);
  }

  public deletarServico(servicoId: number): Observable<string> {
    return this.http.delete<string>(this.baseURL + servicoId);
  }
}
