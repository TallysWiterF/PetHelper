import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PetShop } from 'src/app/models/petshop';
import { Servico } from 'src/app/models/servico';
import { PetshopService } from 'src/app/services/petshop.service';
import { ServicoService } from 'src/app/services/servico.service';
import { PetshopDetailComponent } from './petshop-detail/petshop-detail.component';

@Component({
  selector: 'app-petshop',
  templateUrl: './petshop.component.html',
  styleUrls: ['./petshop.component.scss']
})
export class PetshopComponent implements OnInit {

  petShopId: number = 0;
  petShop: PetShop = {
    id: 0,
    nome: '',
    telefone: '',
    email: '',
    senha: '',
    endereco: '',
    fotoPrincipal: '',
    logo: '',
    ativo: false,
    dataCriacao: new Date,
    dataAtualizacao: new Date,
  };
  servicos: Servico[] = []
  servicosFiltrados: any;

  constructor(private router: Router,
    private petShopService: PetshopService,
    private servicoService: ServicoService,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.petShopId = +this.router.url.split('/')[2]
    if (this.petShopId && this.petShopId > 0) {
      this.getPetShop();
      this.getServicos();
    }
  }

  public novoAgendamento(id: number) {
    const cadastroModal = this.modalService.open(PetshopDetailComponent, { ariaLabelledBy: 'modal-basic-title', size: 'md', centered: true });
    cadastroModal.componentInstance.title = "Novo Agendamento";
    cadastroModal.componentInstance.petShopComponent = this;
    cadastroModal.componentInstance.petShopId = this.petShopId;
    cadastroModal.componentInstance.servico = this.servicos.find(x => x.id == id);
  }

  private async getPetShop() {
    this.spinner.show();
    (await this.petShopService.getPetShop(this.petShopId)).subscribe({
      next: (petShop: PetShop) => {
        this.petShop = petShop;
      },
      error: (objectError: any) => {
        this.spinner.hide();
        this.toastr.error(objectError.error.resposta, 'Erro!')
      },
      complete: () => this.spinner.hide()
    });
  }

  private async getServicos() {
    this.spinner.show();
    (await this.servicoService.getAllServicosAtivosByPetShopId(this.petShopId, true)).subscribe({
      next: (servicos: Servico[]) => {
        this.servicosFiltrados = this.servicos = servicos;
      },
      error: (objectError: any) => {
        this.spinner.hide();
        this.toastr.error(objectError.error.resposta, 'Erro!')
      },
      complete: () => this.spinner.hide()
    });
  }
}
