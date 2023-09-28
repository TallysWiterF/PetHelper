/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServicoService } from './servico.service';

describe('Service: Servico', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServicoService]
    });
  });

  it('should ...', inject([ServicoService], (service: ServicoService) => {
    expect(service).toBeTruthy();
  }));
});
