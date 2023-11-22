/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AutenticacaoService } from './autenticacao.service';

describe('Service: Autenticacao', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AutenticacaoService]
    });
  });

  it('should ...', inject([AutenticacaoService], (service: AutenticacaoService) => {
    expect(service).toBeTruthy();
  }));
});
