import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { ClienteDetailComponent } from 'src/app/shared/cliente-detail/cliente-detail.component';
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
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal) { }

  ngOnInit() {
    // this.spinner.show();
    // this.getClientes();
    // setTimeout(() => {
    // }, 300);

    this.clientesFiltrados = this.clientes;
  }

  public get filtroLista() {
    return this._filtroLista
  }

  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.clientesFiltrados = this.filtroLista ? this.filtrarClientes(this.filtroLista) : this.clientes;
  }

  private _filtroLista: string = '';

  clientes: Cliente[] = [
    {
      id: 1,
      nome: 'Tallys Witer',
      telefone: '(12)34567-8910',
      endereco: 'Rua da Alegria 48 - Paraíso',
      complemento: 'Casa',
      dataUltimaAtualizacao: '07/09/2023'
    },
    {
      id: 2,
      nome: 'Fernando dos Reis',
      telefone: '(12)34567-8910',
      endereco: 'Rua da Tristeza 84 - Terra',
      complemento: 'Apt 201',
      dataUltimaAtualizacao: '08/09/2023'
    }
  ]

  public clientesFiltrados: Cliente[] = [];

  filtrarClientes(filtroLista: string): Cliente[] {
    filtroLista = filtroLista.toLocaleLowerCase();

    return this.clientes.filter(
      (cliente: { nome: string, endereco: string }) => cliente.nome.toLocaleLowerCase().indexOf(filtroLista) !== -1 ||
        cliente.endereco.toLocaleLowerCase().indexOf(filtroLista) !== -1
    );
  }

  novoCliente() {
    const modalRef = this.modalService.open(ClienteDetailComponent, { ariaLabelledBy: 'modal-basic-title', size: 'md', centered: true });
    modalRef.componentInstance.title = "Cadastro de Cliente";
  }

  editarCliente(id: number){
    const modalRef = this.modalService.open(ClienteDetailComponent, { ariaLabelledBy: 'modal-basic-title', size: 'md', centered: true });
    modalRef.componentInstance.title = "Editar Cliente";
    modalRef.componentInstance.cliente = this.clientes.find(x => x.id == id);
  }

  public getClientes() {
    this.clienteService.getClientes().subscribe({
      next: (clientes: Cliente[]) => {
        this.clientes = clientes;
        this.clientesFiltrados = this.clientes;
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toastr.error('Falha ao carregar os Clientes.', 'Erro!')
      },
      complete: () => this.spinner.hide()
    });
  }
}
