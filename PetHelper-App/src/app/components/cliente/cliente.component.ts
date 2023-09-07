import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from 'src/app/models/cliente';
import { ClienteDetailComponent } from 'src/app/shared/cliente-detail/cliente-detail.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  modalAberto: boolean = false;
  closeResult = '';
  cliente: Cliente = {
    nome: '',
    telefone: '31995586125',
    endereco: 'Vista Alegre 48 - Paraíso',
    complemento: 'Casa',
  };

 abrirModal() {
  console.log('clico')
    this.modalAberto = true;
  }

  openModal() {
    console.log('clico')
    const modalRef = this.modalService.open(ClienteDetailComponent, { ariaLabelledBy: 'modal-basic-title', size: 'md', centered: true  });
    modalRef.componentInstance.title = "Cadastro de Cliente";
    modalRef.componentInstance.cliente = this.cliente;
  }


}
