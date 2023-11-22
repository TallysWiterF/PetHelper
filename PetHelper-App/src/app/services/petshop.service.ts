import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PetShop } from '../models/petshop';

@Injectable({
  providedIn: 'root'
})
export class PetshopService {

  constructor(private http: HttpClient) { }

  private baseURL: string = environment.baseURL + 'PetShop/';

  public async getPetShop(petShopId: number): Promise<Observable<PetShop>> {
    return this.http.get<PetShop>(`${this.baseURL}${petShopId}`);
  }

}
