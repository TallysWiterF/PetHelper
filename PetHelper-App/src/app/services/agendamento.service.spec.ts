/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AgendamentoService } from './agendamento.service';

describe('Service: Agendamento', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AgendamentoService]
    });
  });

  it('should ...', inject([AgendamentoService], (service: AgendamentoService) => {
    expect(service).toBeTruthy();
  }));
});
