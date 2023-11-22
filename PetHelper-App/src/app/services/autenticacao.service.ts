// autenticacao.service.ts
import { Injectable } from '@angular/core';
import { PetShop } from '../models/petshop';

const PET_SHOP_ID_KEY = 'petShopId';

@Injectable({
  providedIn: 'root'
})

export class AutenticacaoService {
  private autenticado: boolean = false;
  private petShop: any;

  constructor() {
    this.autenticado = false;
  }

  get isAutenticado(): boolean {
    return this.getPetShopId != null && this.getPetShopId != undefined && this.getPetShopId != 0;
  }

  get getPetShop(): PetShop {
    return this.petShop;
  }

  public setAutenticacao(value: boolean, petShop?: PetShop): void {
    this.autenticado = value;
    if (this.autenticado) {
      this.petShop = petShop;
      localStorage.setItem(PET_SHOP_ID_KEY, this.petShop.id.toString() || '');
    }
    else {
      localStorage.removeItem(PET_SHOP_ID_KEY);
    }
  }

  get getPetShopId(): number {
    const storedValue = localStorage.getItem(PET_SHOP_ID_KEY);
    return parseInt(storedValue || '0');
  }
}
