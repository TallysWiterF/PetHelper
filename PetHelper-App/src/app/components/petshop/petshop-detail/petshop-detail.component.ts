import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PrecoFormatPipe } from 'src/app/helpers/PrecoFormat.pipe';
import { Agendamento } from 'src/app/models/agendamento';
import { AgendamentoService } from 'src/app/services/agendamento.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { ServicoService } from 'src/app/services/servico.service';
import { PetshopComponent } from '../petshop.component';
import { Servico } from 'src/app/models/servico';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { DateTimeFormatPipe } from 'src/app/helpers/DateTimeFormat.pipe';
import { Cliente } from 'src/app/models/cliente';
import { Pet, RacasEnum } from 'src/app/models/pet';
import { listaRacasCachorros } from 'src/app/shared/const/ListaRacasCachorros';
import { listaRacasGatos } from 'src/app/shared/const/ListaRacasGatos';
import { TypeaheadMatch, TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { CommonModule } from '@angular/common';
import { TelefoneFormatPipe } from 'src/app/helpers/TelefoneFormat.pipe';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-petshop-detail',
  templateUrl: './petshop-detail.component.html',
  styleUrls: ['./petshop-detail.component.scss'],
  standalone: true,
  imports:[ReactiveFormsModule, CommonModule, TypeaheadModule, TooltipModule, BsDatepickerModule, DateTimeFormatPipe, TelefoneFormatPipe],
  providers: [AgendamentoService, ClienteService, ServicoService, ],
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
  DateTimeFormat: DateTimeFormatPipe | undefined
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
      complemento: '',
      pets: []
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
    petId: 0,
    pet: {
      id: 0,
      petShopId: this.petShopId,
      clienteId: 0,
      nome: '',
      raca: '',
      tipo: 1,
    },
    horarioMarcado: '',
    dataAgendamento: new Date()
  };
  public Pets: Pet[] = [];
  public semHorarioDisponivel = "Nenhum horário disponível."
  public RacasEnum: RacasEnum = RacasEnum.Cachorro;
  public ListaRacasCachorros = Object.values(listaRacasCachorros);
  public ListaRacasGatos = Object.values(listaRacasGatos);
  public formAgendamento: FormGroup = this.formBuilder.group({});
  public formCliente: FormGroup = this.formBuilder.group({});
  public horariosDisponiveis: string[] = [];

  constructor(private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private agendamentoService: AgendamentoService,
    private localeService: BsLocaleService,
    private dateTimeFormatPipe: DateTimeFormatPipe,
    private clienteService: ClienteService,
  ) {
    localeService.use('pt-br');
  }

  ngOnInit() {
    this.inicializarFormulario()
  }

  private inicializarFormulario(): void {
    this.agendamento.servico = this.servico;
    this.agendamento.servicoId = this.servico.id;
    this.agendamento.cliente.petShopId = this.agendamento.petShopId =  this.petShopId;

    this.formAgendamento = this.formBuilder.group({
      nomePetAgendamento: [this.agendamento.pet.nome, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]]
    });

    this.formCliente = this.formBuilder.group({
      nome: [this.agendamento.cliente.nome, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      telefone: [this.agendamento.cliente.telefone, [Validators.required, Validators.minLength(11)]],
      endereco: [this.agendamento.cliente.endereco, [Validators.maxLength(100)]],
      complemento: [this.agendamento.cliente.complemento, [Validators.maxLength(130)]],
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

  onSelectPet(event: TypeaheadMatch): void {
    this.agendamento.petId = event.item.id;
    this.agendamento.pet = event.item;
  }

  onDateSelected(event: Date): void {
    this.agendamento.dataAgendamento = this.dateTimeFormatPipe.parseDate(event);
    this.agendamento.horarioMarcado = '';
    this.getHorariosDisponiveis();
  }

  private tratarRetornoCliente(cliente: Cliente): void {
    this.agendamento.clienteId = cliente.id;
    this.agendamento.cliente = cliente;

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
           (this.etapa === 'cliente' && (this.formCliente.invalid || this.formAgendamento.invalid));
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
        this.tratarRetornoCliente(cliente);
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
