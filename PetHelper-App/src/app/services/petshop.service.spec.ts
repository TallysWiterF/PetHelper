/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PetshopService } from './petshop.service';

describe('Service: Petshop', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PetshopService]
    });
  });

  it('should ...', inject([PetshopService], (service: PetshopService) => {
    expect(service).toBeTruthy();
  }));
});
