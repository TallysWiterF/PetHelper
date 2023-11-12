import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PetShop } from '../models/petshop';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  private baseURL: string = environment.baseURL + 'PetShop/';

  public async realizarLogin(email: string, senha: string): Promise<Observable<PetShop>> {
    const dadosLogin = { email: email, senha: senha };
    return this.http.post<PetShop>(`${this.baseURL}/login`, dadosLogin);
  }
}
