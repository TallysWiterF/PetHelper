import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Servico } from 'src/app/models/servico';
import { ServicoService } from 'src/app/services/servico.service';
import { ServicoDetailComponent } from 'src/app/components/servico/servico-detail/servico-detail.component';

@Component({
  selector: 'app-servico',
  templateUrl: './servico.component.html',
  styleUrls: ['./servico.component.scss'],
})
export class ServicoComponent implements OnInit {

  constructor(private servicoService: ServicoService,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService,
    private modalService: NgbModal) { }

  public activeModal?: NgbActiveModal;
  public servicoId: number = 0;
  exibirImagem: boolean = true;
  larguraImagem: number = 100;
  margemImagem: number = 2;
  private _filtroLista: string = '';
  servicosFiltrados: any;
  servicos: Servico[] = [];

  ngOnInit() {
    this.spinner.show();
    this.getServicos();
    setTimeout(() => {
    }, 300);
  }

  public get filtroLista() {
    return this._filtroLista
  }

  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.servicosFiltrados = this.filtroLista ? this.filtrarServicos(this.filtroLista) : this.servicos;
  }

  private filtrarServicos(filtroLista: string): Servico[] {
    filtroLista = filtroLista.toLocaleLowerCase();

    return this.servicos.filter((servico: { nome: string }) => servico.nome.toLocaleLowerCase().indexOf(filtroLista) !== -1);
  }

  public alterarVisibilidade(): void {
    this.exibirImagem = !this.exibirImagem;
  }

  public async habilitarServico(servico: Servico, event: Event) {
    event.stopPropagation();

    servico.ativo = !servico.ativo;

    (await this.servicoService.editarServico(servico)).subscribe({
      error: (objectError: any) => {
        this.spinner.hide();
        this.toastr.error(objectError.error.resposta, 'Erro!');
        servico.ativo = !servico.ativo;
      },
      complete: () => this.spinner.hide()
    });
    setTimeout(() => {
    }, 300);
  }

  public abrirTemplate(template: TemplateRef<any>, servicoId: number, event: Event): void {
    this.activeModal = this.modalService.open(template, { ariaLabelledBy: 'modal-basic-title', size: 'sm' });
    this.servicoId = servicoId;
    event.stopPropagation();
  }

  public fecharDeletarTemplate() {
    if (this.activeModal)
      this.activeModal.dismiss();
  }

  public async excluirServico() {
    this.spinner.show();
    (await this.servicoService.deletarServico(this.servicoId)).subscribe({
      next: (object: any) => {
        this.toastr.info(object.resposta, 'Aviso!');
        this.getServicos();
      },
      error: (objectError: any) => {
        this.spinner.hide();
        this.toastr.error(objectError.error.resposta, 'Erro!')
      },
      complete: () => this.spinner.hide()
    });

    this.fecharDeletarTemplate();
  }

  public novoServico() {
    const cadastroModal = this.modalService.open(ServicoDetailComponent, { ariaLabelledBy: 'modal-basic-title', size: 'md', centered: true });
    cadastroModal.componentInstance.title = "Cadastro de Serviço";
    cadastroModal.componentInstance.ServicoComponent = this;
    cadastroModal.result.then((result) => {
      this.getServicos();
    }, (reason) => {
      this.getServicos();
    });
  }

  public editarServico(id: number) {
    const editarModal = this.modalService.open(ServicoDetailComponent, { ariaLabelledBy: 'modal-basic-title', size: 'md', centered: true });
    editarModal.componentInstance.title = "Editar Serviço";
    editarModal.componentInstance.servico = this.servicos.find(x => x.id == id);
    editarModal.componentInstance.ServicoComponent = this;

    editarModal.result.then((result) => {
      this.getServicos();
    }, (reason) => {
      this.getServicos();
    });
  }

  private async getServicos() {
    this.spinner.show();
    (await this.servicoService.getAllServicos(true)).subscribe({
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
