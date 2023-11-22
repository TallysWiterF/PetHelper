import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { ClienteDetailComponent } from 'src/app/components/cliente/cliente-detail/cliente-detail.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
  providers: [ClienteService]
})

export class ClienteComponent implements OnInit {

  constructor(private clienteService: ClienteService,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService,
    private modalService: NgbModal) { }

  private _filtroLista: string = '';

  public clientes: Cliente[] = [];
  public clientesFiltrados: Cliente[] = [];
  public activeModal?: NgbActiveModal;
  public clienteId: number = 0;

  ngOnInit() {
    this.spinner.show();
    this.getClientes();
    setTimeout(() => {
    }, 300);

  }

  public get filtroLista() {
    return this._filtroLista
  }

  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.clientesFiltrados = this.filtroLista ? this.filtrarClientes(this.filtroLista) : this.clientes;
  }

  private filtrarClientes(filtroLista: string): Cliente[] {
    filtroLista = filtroLista.toLocaleLowerCase();

    return this.clientes.filter(
      (cliente: { nome: string, endereco: string }) => cliente.nome.toLocaleLowerCase().indexOf(filtroLista) !== -1 ||
        cliente.endereco.toLocaleLowerCase().indexOf(filtroLista) !== -1
    );
  }

  public abrirTemplate(template: TemplateRef<any>, clienteId: number, event: Event): void {
    this.activeModal = this.modalService.open(template, { ariaLabelledBy: 'modal-basic-title', size: 'sm' });
    this.clienteId = clienteId;
    event.stopPropagation();
  }

  public fecharTemplate() {
    if (this.activeModal)
      this.activeModal.dismiss();
  }

  public abrirWhatsAppComMensagem(telefone: string ,event: Event) {
    window.open(`https://wa.me/${telefone}`, '_blank');
  }

  public async excluirCliente() {
    this.spinner.show();
    (await this.clienteService.deletarCliente(this.clienteId)).subscribe({
      next: (object: any) => {
        this.toastr.info(object.resposta, 'Aviso!');
        this.getClientes();
      },
      error: (objectError: any) => {
        this.spinner.hide();
        this.toastr.error(objectError.error.resposta, 'Erro!')
      },
      complete: () => this.spinner.hide()
    });

    this.fecharTemplate();
  }

  public novoCliente() {
    const cadastroModal = this.modalService.open(ClienteDetailComponent, { ariaLabelledBy: 'modal-basic-title', size: 'md', centered: true });
    cadastroModal.componentInstance.title = "Cadastro de Cliente";
    cadastroModal.componentInstance.clienteComponent = this;
    cadastroModal.result.then((result) => {
      this.getClientes();
    }, (reason) => {
      this.getClientes();
    });
  }

  public editarCliente(id: number) {
    const editarModal = this.modalService.open(ClienteDetailComponent, { ariaLabelledBy: 'modal-basic-title', size: 'md', centered: true });
    editarModal.componentInstance.title = "Editar Cliente";
    editarModal.componentInstance.cliente = this.clientes.find(x => x.id == id);
    editarModal.componentInstance.clienteComponent = this;
    editarModal.result.then((result) => {
      this.getClientes();
    }, (reason) => {
      this.getClientes();
    });
  }

  public async getClientes() {
    this.spinner.show();
    (await this.clienteService.getAllClientes()).subscribe({
      next: (clientes: Cliente[]) => {
        this.clientesFiltrados = this.clientes = clientes;
      },
      error: (objectError: any) => {
        this.spinner.hide();
        this.toastr.error(objectError.error.resposta, 'Erro!')
      },
      complete: () => this.spinner.hide()
    });
  }
}
