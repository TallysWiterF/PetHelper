import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servico } from '../models/servico';
import { environment } from 'src/environments/environment';
import { AutenticacaoService } from './autenticacao.service';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {

  constructor(private http: HttpClient,
    private autenticacaoService: AutenticacaoService) { }

  private baseURL: string = environment.baseURL + "Servico/";
  private petShopId = this.autenticacaoService.getPetShopId;

  public async getAllServicos(retornarLogoServico: boolean): Promise<Observable<Servico[]>> {
    return this.http.get<Servico[]>(`${this.baseURL}petShopId/${this.petShopId}/${retornarLogoServico}`);
  }

  public async getAllServicosAtivosByPetShopId(petShopId: number, ativo: boolean): Promise<Observable<Servico[]>> {
    return this.http.get<Servico[]>(`${this.baseURL}petShopId/${petShopId}/ativo/${ativo}`);
  }

  public async adicionarServico(servico: Servico): Promise<Observable<Servico>>{
    return this.http.post<Servico>(this.baseURL, servico);
  }

  public async editarServico(servico: Servico): Promise<Observable<Servico>>{
    return this.http.put<Servico>(this.baseURL, servico);
  }

  public async deletarServico(servicoId: number): Promise<Observable<string>> {
    return this.http.delete<string>(`${this.baseURL}${servicoId}`);
  }
}
