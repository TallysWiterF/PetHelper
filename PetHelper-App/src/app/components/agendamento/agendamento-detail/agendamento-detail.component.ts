import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PrecoFormatPipe } from 'src/app/helpers/PrecoFormat.pipe';
import { Agendamento } from 'src/app/models/agendamento';
import { Cliente } from 'src/app/models/cliente';
import { Servico } from 'src/app/models/servico';
import { AgendamentoService } from 'src/app/services/agendamento.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { ServicoService } from 'src/app/services/servico.service';
import { AgendamentoComponent } from '../agendamento.component';
import { TypeaheadMatch, TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { Pet, RacasEnum } from 'src/app/models/pet';
import { listaRacasCachorros } from 'src/app/shared/const/ListaRacasCachorros';
import { listaRacasGatos } from 'src/app/shared/const/ListaRacasGatos';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TelefoneFormatPipe } from 'src/app/helpers/TelefoneFormat.pipe';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-agendamento-detail',
  templateUrl: './agendamento-detail.component.html',
  styleUrls: ['./agendamento-detail.component.scss'],
  standalone: true,
  imports:[ReactiveFormsModule, CommonModule, TypeaheadModule, BsDatepickerModule, NgxMaskDirective, TelefoneFormatPipe, TooltipModule],
  providers: [AgendamentoService, ClienteService, ServicoService],
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
      complemento: '',
      pets: []
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
    petId: 0,
    pet: {
      id: 0,
      petShopId: this.autenticacaoService.getPetShopId,
      clienteId: 0,
      nome: '',
      raca: '',
      tipo: 1,
    },
    horarioMarcado: '',
    dataAgendamento: new Date()
  };
  @Input() agendamentoComponent?: AgendamentoComponent;

  public clientes: Cliente[] = [];
  public Pets: Pet[] = [];
  public servicos: Servico[] = [];
  public horariosDisponiveis: string[] = [];
  public formAgendamento: FormGroup = this.formBuilder.group({});
  public formCliente: FormGroup = this.formBuilder.group({});
  public formServico: FormGroup = this.formBuilder.group({});
  public precoFormatado: string = this.precoFormatPipe.transform(this.agendamento.servico.preco);
  public etapa: 'cliente' | 'servico' | 'agendamento' = 'cliente';
  public RacasEnum: RacasEnum = RacasEnum.Cachorro;
  public ListaRacasCachorros = Object.values(listaRacasCachorros);
  public ListaRacasGatos = Object.values(listaRacasGatos);

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

    //Validar erro aqui, ao editar o cliente e trocar a pessoa do agendamento isso funciona, porem, quando é um novo agendamento não funciona.
    this.Pets = [];

    this.agendamento.pet = {
      id: 0,
      petShopId: this.agendamento.petShopId,
      clienteId: 0,
      nome: '',
      raca: '',
      tipo: 1,
    };

    (this.formCliente.get('Pets') as FormArray).clear();
    if (this.agendamento.cliente.pets != undefined) {

      this.Pets = [...this.agendamento.cliente.pets];
      // Adiciona controles para Pets existentes
      this.agendamento.cliente.pets.forEach(pet => {
        const petControl = this.formBuilder.group({
          'nomePet': [pet.nome, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
          'racaPet': [pet.raca, [Validators.required, Validators.minLength(3), Validators.maxLength(70)]],
          'tipo': [pet.tipo, [Validators.required]]
        });

        (this.formCliente.get('Pets') as FormArray).push(petControl);
      });
    }
  }

  onSelectPet(event: TypeaheadMatch): void {
    this.agendamento.petId = event.item.id;
    this.agendamento.pet = event.item;
  }

  onSelectServico(event: TypeaheadMatch): void {
    this.agendamento.servicoId = event.item.id;
    this.agendamento.servico = event.item;
    this.precoFormatado = this.precoFormatPipe.transform(this.agendamento.servico.preco);
  }

  get controlsAgendamento(): any {
    return this.formAgendamento.controls;
  }

  get controlsCliente(): any {
    return this.formCliente.controls;
  }

  get controlsPet(): any {
    return (this.formCliente.get('Pets') as FormArray).controls;
  }

  get controlsServico(): any {
    return this.formServico.controls;
  }

  private inicializarFormulario(): void {

    this.formAgendamento = this.formBuilder.group({
      nomePetAgendamento: [this.agendamento.pet.nome, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]]
    });

    this.formCliente = this.formBuilder.group({
      nome: [this.agendamento.cliente.nome, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      telefone: [this.agendamento.cliente.telefone, [Validators.required, Validators.minLength(11)]],
      endereco: [this.agendamento.cliente.endereco, [Validators.maxLength(100)]],
      complemento: [this.agendamento.cliente.complemento, Validators.maxLength(130)],
      'Pets': this.formBuilder.array([])
    });

    if (this.agendamento.cliente.pets != undefined) {

      this.Pets = [];
      this.Pets = [...this.agendamento.cliente.pets];

      // Adiciona controles para Pets existentes
      this.agendamento.cliente.pets.forEach(pet => {
        const petControl = this.formBuilder.group({
          'nomePet': [pet.nome, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
          'racaPet': [pet.raca, [Validators.required, Validators.minLength(3), Validators.maxLength(70)]],
          'tipo': [pet.tipo, [Validators.required]]
        });

        (this.formCliente.get('Pets') as FormArray).push(petControl);
      });
    }

    this.formServico = this.formBuilder.group({
      nome: [this.agendamento.servico.nome, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      preco: [this.precoFormatado],
      descricao: [this.agendamento.servico.descricao, Validators.maxLength(100)],
    });
  }

  public onChangeTipoPet(index: number, tipo: number): void {
    if (this.agendamento.cliente.pets[index] != undefined)
      this.agendamento.cliente.pets[index].raca = "";

    if (tipo === RacasEnum.Gato) {
      this.agendamento.cliente.pets[index].tipo = RacasEnum.Gato;
    } else if (tipo === RacasEnum.Cachorro) {
      this.agendamento.cliente.pets[index].tipo = RacasEnum.Cachorro;
    }
  }

  public adicionarPet(): void {

    if (!this.agendamento.cliente.pets) {
      this.agendamento.cliente.pets = [];
    }

    const novoPet: Pet = {
      id: 0,
      petShopId: this.agendamento.cliente.petShopId,
      clienteId: this.agendamento.cliente.id,
      nome: '',
      raca: '',
      tipo: RacasEnum.Cachorro,
    };

    this.agendamento.cliente.pets.push(novoPet);
    this.Pets = []
    this.Pets = [...this.agendamento.cliente.pets];

    const novoPetControl = this.formBuilder.group({
      'nomePet': [novoPet.nome, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      'racaPet': [novoPet.raca, [Validators.required, Validators.minLength(3), Validators.maxLength(70)]],
      'tipo': [novoPet.tipo, [Validators.required]]
    });

    (this.formCliente.get('Pets') as FormArray).push(novoPetControl);
  }

  public removerPet(index: number) {
    this.agendamento.cliente.pets.splice(index, 1);
    this.Pets = [];
    this.Pets = [...this.agendamento.cliente.pets];

    const petsFormArray = this.formCliente.get('Pets') as FormArray;
    petsFormArray.removeAt(index);
  }

  public onSelectRaca(index: number, $event: TypeaheadMatch) {
    this.agendamento.cliente.pets[index].raca = $event.item;
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

    if(this.etapa == 'cliente'){
      return this.formCliente.invalid || this.formAgendamento.invalid;
    }
    else if (this.etapa == 'servico'){
      return this.formServico.invalid;
    }

    return false;
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
