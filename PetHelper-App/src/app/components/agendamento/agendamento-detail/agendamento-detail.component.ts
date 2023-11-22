import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PrecoFormatPipe } from 'src/app/helpers/PrecoFormat.pipe';
import { Agendamento } from 'src/app/models/agendamento';
import { Cliente } from 'src/app/models/cliente';
import { Servico } from 'src/app/models/servico';
import { AgendamentoService } from 'src/app/services/agendamento.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { ServicoService } from 'src/app/services/servico.service';
import { AgendamentoComponent } from '../agendamento.component';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';

@Component({
  selector: 'app-agendamento-detail',
  templateUrl: './agendamento-detail.component.html',
  styleUrls: ['./agendamento-detail.component.scss'],
  providers: [AgendamentoService, ClienteService, ServicoService, PrecoFormatPipe],
})
export class AgendamentoDetailComponent implements OnInit {

  @Input() title: string = 'Modal';
  @Input() public agendamento: Agendamento = {
    id: 0,
    petShopId: this.autenticacaoService.getPetShopId,
    clienteId: 0,
    cliente: {
      id: 0,
      petShopId: this.autenticacaoService.getPetShopId,
      nome: '',
      telefone: '',
      endereco: '',
      complemento: ''
    },
    servicoId: 0,
    servico: {
      id: 0,
      petShopId: this.autenticacaoService.getPetShopId,
      nome: '',
      descricao: '',
      preco: 0,
      ativo: true
    },
    horarioMarcado: '',
    dataAgendamento: new Date()
  };
  @Input() agendamentoComponent?: AgendamentoComponent;

  public clientes: Cliente[] = [];
  public servicos: Servico[] = [];
  public horariosDisponiveis: string[] = [];
  public formCliente: FormGroup = this.formBuilder.group({});
  public formServico: FormGroup = this.formBuilder.group({});
  public precoFormatado: string = this.precoFormatPipe.transform(this.agendamento.servico.preco);
  public etapa: 'cliente' | 'servico' | 'agendamento' = 'cliente';

  constructor(private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private precoFormatPipe: PrecoFormatPipe,
    private agendamentoService: AgendamentoService,
    private clienteService: ClienteService,
    private servicoService: ServicoService,
    private autenticacaoService: AutenticacaoService) { }

  ngOnInit() {
    this.atualizarValorFormatado();
    this.inicializarFormulario();
    this.getClientesServicos();
    this.getHorariosDisponiveis();
  }

  onSelectCliente(event: TypeaheadMatch): void {
    this.agendamento.clienteId = event.item.id;
    this.agendamento.cliente = event.item;
  }

  onSelectServico(event: TypeaheadMatch): void {
    this.agendamento.servicoId = event.item.id;
    this.agendamento.servico = event.item;
    this.precoFormatado = this.precoFormatPipe.transform(this.agendamento.servico.preco);
  }

  get controlsCliente(): any {
    return this.formCliente.controls;
  }

  get controlsServico(): any {
    return this.formServico.controls;
  }

  private inicializarFormulario(): void {
    this.formCliente = this.formBuilder.group({
      nome: [this.agendamento.cliente.nome, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      telefone: [this.agendamento.cliente.telefone, [Validators.required, Validators.minLength(11)]],
      endereco: [this.agendamento.cliente.endereco, [Validators.maxLength(100)]],
      complemento: [this.agendamento.cliente.complemento, Validators.maxLength(130)],
    });

    this.formServico = this.formBuilder.group({
      nome: [this.agendamento.servico.nome, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      preco: [this.precoFormatado],
      descricao: [this.agendamento.servico.descricao, Validators.maxLength(100)],
    });
  }

  private getClientesServicos(): void {
      this.getClientes();
      this.getServicos();
  }

  public fecharModal(): void {
    this.activeModal.dismiss();
  }

  public avancar(): void {
    if (this.etapa === 'cliente' && this.formCliente.valid) {
      this.etapa = 'servico';
    }
    else if (this.etapa === 'servico' && this.formServico.valid) {
      this.etapa = 'agendamento';
    }
  }

  public avancarDisabled(): boolean {
    return this.etapa == 'cliente' ? this.formCliente.invalid : this.formServico.invalid
  }

  public voltar(): void {
    if (this.etapa === 'agendamento') {
      this.etapa = 'servico'
    }
    else if (this.etapa === 'servico') {
      this.etapa = 'cliente';
    }
  }

  private atualizarValorFormatado(): void {
    this.precoFormatado = this.precoFormatPipe.transform(this.agendamento.servico.preco);
  }

  private atualizarValorNumerico(): void {
    this.agendamento.servico.preco = this.precoFormatPipe.parse(this.precoFormatado);
  }

  public async salvarAgendamento() {
    this.atualizarValorNumerico();
    this.agendamentoComponent?.spinner.show();
    this.agendamento.id != 0 ? this.editarAgendamento() : this.adicionarAgendamento();
  }

  private async adicionarAgendamento() {
    (await this.agendamentoService.adicionarAgendamento(this.agendamento)).subscribe({
      next: (object: any) => {
        this.agendamentoComponent?.toastr.success(object.resposta, 'Sucesso');
        this.fecharModal();
      },
      error: (objectError: any) => {
        this.agendamentoComponent?.spinner.hide();
        this.agendamentoComponent?.toastr.error(objectError.error.resposta, 'Erro!')
      },
      complete: () => this.agendamentoComponent?.spinner.hide()
    });
  }

  private async editarAgendamento() {
    (await this.agendamentoService.editarAgendamento(this.agendamento)).subscribe({
      next: (object: any) => {
        this.agendamentoComponent?.toastr.success(object.resposta, 'Sucesso');
        this.fecharModal();
      },
      error: (objectError: any) => {
        this.agendamentoComponent?.spinner.hide();
        this.agendamentoComponent?.toastr.error(objectError.error.resposta, 'Erro!')
      },
      complete: () => this.agendamentoComponent?.spinner.hide()
    });
  }

  private async getClientes() {
    this.agendamentoComponent?.spinner.show();
    (await this.clienteService.getAllClientes()).subscribe({
      next: (clientes: Cliente[]) => {
        this.clientes = clientes;
      },
      error: (objectError: any) => {
        this.agendamentoComponent?.spinner.hide();
        this.agendamentoComponent?.toastr.error(objectError.error.resposta, 'Erro!')
      },
      complete: () => this.agendamentoComponent?.spinner.hide()
    });
  }

  private async getServicos() {
    this.agendamentoComponent?.spinner.show();
    (await this.servicoService.getAllServicos(false)).subscribe({
      next: (servicos: Servico[]) => {
        this.servicos = servicos;
      },
      error: (objectError: any) => {
        this.agendamentoComponent?.spinner.hide();
        this.agendamentoComponent?.toastr.error(objectError.error.resposta, 'Erro!')
      },
      complete: () => this.agendamentoComponent?.spinner.hide()
    });
  }

  private async getHorariosDisponiveis() {
    this.agendamentoComponent?.spinner.show();
    (await this.agendamentoService.getHorariosDisponiveis(this.agendamento.dataAgendamento)).subscribe({
      next: (horariosDisponiveis: string[]) => {
        this.horariosDisponiveis = horariosDisponiveis;
      },
      error: (objectError: any) => {
        this.agendamentoComponent?.spinner.hide();
        this.agendamentoComponent?.toastr.error(objectError.error.resposta, 'Erro!')
      },
      complete: () => this.agendamentoComponent?.spinner.hide()
    });
  }
}
