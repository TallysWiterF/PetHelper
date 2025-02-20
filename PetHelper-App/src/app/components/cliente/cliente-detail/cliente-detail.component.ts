import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadMatch, TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgxMaskDirective } from 'ngx-mask';
import { ClienteComponent } from 'src/app/components/cliente/cliente.component';
import { Cliente } from 'src/app/models/cliente';
import { Pet, RacasEnum } from 'src/app/models/pet';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { listaRacasCachorros } from 'src/app/shared/const/ListaRacasCachorros';
import { listaRacasGatos } from 'src/app/shared/const/ListaRacasGatos';

@Component({
  selector: 'app-cliente-detail',
  templateUrl: './cliente-detail.component.html',
  styleUrls: ['./cliente-detail.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TypeaheadModule, NgxMaskDirective, TooltipModule],
  providers: [ClienteService]
})

export class ClienteDetailComponent implements OnInit {

  @Input() title: string = 'Modal';
  @Input() clienteComponent?: ClienteComponent;
  @Input() public cliente: Cliente = {
    id: 0,
    petShopId: this.autenticacaoService.getPetShopId,
    nome: '',
    telefone: '',
    endereco: '',
    complemento: '',
    pets: []
  };

  public form: FormGroup = this.formBuilder.group({});
  public RacasEnum: RacasEnum = RacasEnum.Cachorro;
  public ListaRacasCachorros = Object.values(listaRacasCachorros);
  public ListaRacasGatos = Object.values(listaRacasGatos);

  constructor(private clienteService: ClienteService,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private autenticacaoService: AutenticacaoService) { }

  ngOnInit() {
    this.inicializarFormulario();
  }

  get controls(): any {
    return this.form.controls;
  }

  get controlsPet(): any {
    return (this.form.get('Pets') as FormArray).controls;
  }

  private inicializarFormulario(): void {
    this.form = this.formBuilder.group({
      nome: [this.cliente.nome, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      telefone: [this.cliente.telefone, [Validators.required, Validators.minLength(11)]],
      endereco: [this.cliente.endereco, [Validators.maxLength(100)]],
      complemento: [this.cliente.complemento, Validators.maxLength(130)],
      'Pets': this.formBuilder.array([])
    });

    if (this.cliente.pets != undefined) {

      // Adiciona controles para Pets existentes
      this.cliente.pets.forEach(pet => {
        const petControl = this.formBuilder.group({
          'nomePet': [pet.nome, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
          'racaPet': [pet.raca, [Validators.required, Validators.minLength(3), Validators.maxLength(70)]],
          'tipo': [pet.tipo, [Validators.required]]
        });

        (this.form.get('Pets') as FormArray).push(petControl);
      });
    }
  }

  public onChangeTipoPet(index: number, tipo: number): void {
    if (this.cliente.pets[index] != undefined)
      this.cliente.pets[index].raca = "";

    if (tipo === RacasEnum.Gato) {
      this.cliente.pets[index].tipo = RacasEnum.Gato;
    } else if (tipo === RacasEnum.Cachorro) {
      this.cliente.pets[index].tipo = RacasEnum.Cachorro;
    }
  }

  public adicionarPet(): void {

    if (!this.cliente.pets) {
      this.cliente.pets = [];
    }

    const novoPet: Pet = {
      id: 0,
      petShopId: this.cliente.petShopId,
      clienteId: this.cliente.id,
      nome: '',
      raca: '',
      tipo: RacasEnum.Cachorro,
    };

    this.cliente.pets.push(novoPet);

    const novoPetControl = this.formBuilder.group({
      'nomePet': [novoPet.nome, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      'racaPet': [novoPet.raca, [Validators.required, Validators.minLength(3), Validators.maxLength(70)]],
      'tipo': [novoPet.tipo, [Validators.required]]
    });

    (this.form.get('Pets') as FormArray).push(novoPetControl);
  }

  public removerPet(index: number) {
    this.cliente.pets.splice(index, 1);
    (this.form.get('Pets') as FormArray)

    const petsFormArray = this.form.get('Pets') as FormArray;
    petsFormArray.removeAt(index);
  }

  public onSelectRaca(index: number, $event: TypeaheadMatch) {
    this.cliente.pets[index].raca = $event.item;
  }

  public fecharModal() {
    this.activeModal.dismiss();
  }

  async salvarCliente() {
    this.clienteComponent?.spinner.show();
    this.cliente.id != 0 ? this.editarCliente() : this.adicionarCliente();
  }

  private async adicionarCliente() {
    (await this.clienteService.adicionarCliente(this.cliente)).subscribe({
      next: (object: any) => {
        this.clienteComponent?.toastr.success(object.resposta, 'Sucesso');
        this.fecharModal();
      },
      error: (objectError: any) => {
        this.clienteComponent?.spinner.hide();
        this.clienteComponent?.toastr.error(objectError.error.resposta, 'Erro!')
      },
      complete: () => this.clienteComponent?.spinner.hide()
    });
  }

  private async editarCliente() {
    (await this.clienteService.editarCliente(this.cliente)).subscribe({
      next: (object: any) => {
        this.clienteComponent?.toastr.success(object.resposta, 'Sucesso');
        this.fecharModal();
      },
      error: (objectError: any) => {
        this.clienteComponent?.spinner.hide();
        this.clienteComponent?.toastr.error(objectError.error.resposta, 'Erro!');
      },
      complete: () => this.clienteComponent?.spinner.hide()
    });
  }
}
