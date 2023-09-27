import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClienteComponent } from 'src/app/components/cliente/cliente.component';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-cliente-detail',
  templateUrl: './cliente-detail.component.html',
  styleUrls: ['./cliente-detail.component.scss'],
  providers: [ClienteService]
})
export class ClienteDetailComponent implements OnInit {

  @Input() isOpen: boolean = true;
  @Input() title: string = 'Modal';
  @Input() clienteComponent?: ClienteComponent;
  @Input() public cliente: Cliente = {
    id: 0,
    petShopId: 1,
    nome: '',
    telefone: '',
    endereco: '',
    complemento: ''
  };

  form: FormGroup = this.formBuilder.group({});

  constructor(private clienteService: ClienteService,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.inicializarFormulario();
  }

  get controls(): any {
    return this.form.controls;
  }

  private inicializarFormulario(): void {
    this.form = this.formBuilder.group({
      nome: [this.cliente.nome, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      telefone: [this.cliente.telefone, [Validators.required, Validators.minLength(11)]],
      endereco: [this.cliente.endereco, [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
      complemento: [this.cliente.complemento, Validators.maxLength(130)],
    });
  }

  public fecharModal() {
    this.activeModal.dismiss();
  }

  async salvarCliente() {
    this.clienteComponent?.spinner.show();
    this.cliente.id != 0 ? this.editarCliente() : this.adicionarCliente();
  }

  private async adicionarCliente() {
    (await this.clienteService.editarCliente(this.cliente)).subscribe({
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
    (await this.clienteService.adicionarCliente(this.cliente)).subscribe({
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
