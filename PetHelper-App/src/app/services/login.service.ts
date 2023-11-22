import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PetShop } from '../models/petshop';
import { environment } from 'src/environments/environment';
import { Login } from '../models/login';
import { Inscricao } from '../models/inscricao';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  private baseURL: string = environment.baseURL + 'PetShop/';

  public async realizarLogin(dadosLogin: Login): Promise<Observable<PetShop>> {
    return this.http.post<PetShop>(`${this.baseURL}login`, dadosLogin);
  }

  public async realizarInscricao(dadosInscricao: Inscricao): Promise<Observable<string>> {
    return this.http.post<string>(`${this.baseURL}inscricao`, dadosInscricao);
  }
}
