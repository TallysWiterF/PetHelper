import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from 'src/app/models/cliente';

@Component({
  selector: 'app-cliente-detail',
  templateUrl: './cliente-detail.component.html',
  styleUrls: ['./cliente-detail.component.scss']
})
export class ClienteDetailComponent implements OnInit {

  @Input() isOpen: boolean = true;
  @Input() title: string = 'Modal';
  @Input() public cliente: Cliente = {
    nome: '',
    telefone: '',
    endereco: '',
    complemento: ''
  };
  @Output() closeModal = new EventEmitter<void>();

  form: FormGroup = this.formBuilder.group({});

  constructor(private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.inicializarFormulario();
  }

  get controls(): any {
    return this.form.controls;
  }

  inicializarFormulario(): void {
    this.form = this.formBuilder.group({
      nome: [this.cliente.nome, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      telefone: [this.cliente.telefone, [Validators.required, Validators.minLength(11)]],
      endereco: [this.cliente.endereco, [Validators.required, Validators.minLength(8), Validators.maxLength(240)]],
      complemento: [this.cliente.complemento, Validators.maxLength(240)],
    });
  }

  fecharModal() {
    this.activeModal.dismiss();
  }

}
