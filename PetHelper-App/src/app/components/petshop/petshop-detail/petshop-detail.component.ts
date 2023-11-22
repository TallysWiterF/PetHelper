import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PrecoFormatPipe } from 'src/app/helpers/PrecoFormat.pipe';
import { Agendamento } from 'src/app/models/agendamento';
import { AgendamentoService } from 'src/app/services/agendamento.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { ServicoService } from 'src/app/services/servico.service';
import { PetshopComponent } from '../petshop.component';
import { Servico } from 'src/app/models/servico';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { DateTimeFormatPipe } from 'src/app/helpers/DateTimeFormat.pipe';
import { Cliente } from 'src/app/models/cliente';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-petshop-detail',
  templateUrl: './petshop-detail.component.html',
  styleUrls: ['./petshop-detail.component.scss'],
  providers: [AgendamentoService, ClienteService, ServicoService, DateTimeFormatPipe],
})
export class PetshopDetailComponent implements OnInit {

  @Input() title: string = 'Modal';
  @Input() public petShopId: number = 0;
  @Input() petShopComponent?: PetshopComponent;
  @Input() public servico: Servico = {
    id: 0,
    petShopId: 0,
    nome: '',
    descricao: '',
    preco: 0,
    ativo: false
  };
  bsValue = new Date();
  public etapa: 'cliente' | 'calendario' | 'telefone' | 'agendamento' = 'calendario';
  public agendamento: Agendamento = {
    id: 0,
    petShopId: this.petShopId,
    clienteId: 0,
    cliente: {
      id: 0,
      petShopId: this.petShopId,
      nome: '',
      telefone: '',
      endereco: '',
      complemento: ''
    },
    servicoId: this.servico.id,
    servico: {
      id: this.servico.id,
      petShopId: this.petShopId,
      nome: '',
      descricao: '',
      preco: 0,
      ativo: true
    },
    horarioMarcado: '',
    dataAgendamento: new Date()
  };
  public semHorarioDisponivel = "Nenhum horário disponível."
  constructor(private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private agendamentoService: AgendamentoService,
    private localeService: BsLocaleService,
    private dateTimeFormatPipe: DateTimeFormatPipe,
    private clienteService: ClienteService,
  ) {
    localeService.use('pt-br');
  }

  public formCliente: FormGroup = this.formBuilder.group({});
  public horariosDisponiveis: string[] = [];

  ngOnInit() {
    this.inicializarFormulario()
  }

  private inicializarFormulario(): void {
    this.agendamento.servico = this.servico;
    this.agendamento.servicoId = this.servico.id;
    this.agendamento.cliente.petShopId = this.agendamento.petShopId =  this.petShopId;
    this.formCliente = this.formBuilder.group({
      nome: [this.agendamento.cliente.nome, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      telefone: [this.agendamento.cliente.telefone, [Validators.required, Validators.minLength(11)]],
      endereco: [this.agendamento.cliente.endereco, [Validators.maxLength(100)]],
      complemento: [this.agendamento.cliente.complemento, [Validators.maxLength(130)]],
    });
  }

  get controlsCliente() {
    return this.formCliente.controls;
  }

  onDateSelected(event: Date): void {
    this.agendamento.dataAgendamento = this.dateTimeFormatPipe.parseDate(event);
    this.agendamento.horarioMarcado = '';
    this.getHorariosDisponiveis();
  }

  public avancar(): void {
    if (this.etapa === 'calendario')
      this.etapa = 'telefone';
    else if (this.etapa === 'telefone' && this.formCliente.controls["telefone"].valid){
      this.getClienteByPetShopIdTelefone();
      this.etapa = 'cliente';
    }
    else if (this.etapa === 'cliente' && this.formCliente.valid){
      this.etapa = 'agendamento';
    }
  }

  public avancarDisabled(): boolean {
    return (this.etapa === 'telefone' && !this.formCliente.controls["telefone"].valid) ||
           (this.etapa === 'calendario' && this.agendamento.horarioMarcado === '') ||
           (this.etapa === 'cliente' && this.formCliente.invalid);
  }

  public voltar(): void {
    if (this.etapa === 'telefone')
      this.etapa = 'calendario'
    else if (this.etapa === 'cliente')
      this.etapa = 'telefone'
    else if (this.etapa === 'agendamento')
      this.etapa = 'cliente'
  }

  public fecharModal(): void {
    this.activeModal.dismiss();
  }

  private async getHorariosDisponiveis() {
    this.petShopComponent?.spinner.show();
    (await this.agendamentoService.getHorariosDisponiveis(this.agendamento.dataAgendamento)).subscribe({
      next: (horariosDisponiveis: string[]) => {
        this.horariosDisponiveis = horariosDisponiveis;
      },
      error: (objectError: any) => {
        this.petShopComponent?.spinner.hide();
        this.petShopComponent?.toastr.error(objectError.error.resposta, 'Erro!')
      },
      complete: () => this.petShopComponent?.spinner.hide()
    });
  }

  private async getClienteByPetShopIdTelefone() {
    this.petShopComponent?.spinner.show();
    (await this.clienteService.getClienteByPetShopIdTelefone(this.petShopId, this.agendamento.cliente.telefone)).subscribe({
      next: (cliente: Cliente) => {
        this.agendamento.clienteId = cliente.id;
        this.agendamento.cliente = cliente;
      },
      error: (objectError: any) => {
        this.petShopComponent?.spinner.hide();
      },
      complete: () => this.petShopComponent?.spinner.hide()
    });
  }

  public async adicionarAgendamento() {
    (await this.agendamentoService.adicionarAgendamento(this.agendamento)).subscribe({
      next: (object: any) => {
        this.petShopComponent?.toastr.success(object.resposta, 'Sucesso');
        this.fecharModal();
      },
      error: (objectError: any) => {
        this.petShopComponent?.spinner.hide();
        this.petShopComponent?.toastr.error(objectError.error.resposta, 'Erro!')
      },
      complete: () => this.petShopComponent?.spinner.hide()
    });
  }

}
