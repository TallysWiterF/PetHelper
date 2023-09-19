import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Servico } from 'src/app/models/servico';
import { ServicoService } from 'src/app/services/servico.service';

@Component({
  selector: 'app-servicos',
  templateUrl: './servicos.component.html',
  styleUrls: ['./servicos.component.scss']
})
export class ServicosComponent implements OnInit {

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

  habilitarServico(servico: Servico) {
    servico.ativo = !servico.ativo;
  }

  public abrirTemplate(template: TemplateRef<any>, servicoId: number, event: Event): void {
    this.activeModal = this.modalService.open(template, { ariaLabelledBy: 'modal-basic-title', size: 'sm' });
    this.servicoId = servicoId;
    event.stopPropagation();
  }

  fecharTemplate() {
    if (this.activeModal)
      this.activeModal.dismiss();
   }

  excluirServico() {
    throw new Error('Method not implemented.');
  }

  novoServico() {
    throw new Error('Method not implemented.');
  }

  editarServico(id: number) {
    throw new Error('Method not implemented.');
  }

  public getServicos() {
    this.spinner.show();
    this.servicoService.getAllServicos(1).subscribe({
      next: (servicos: Servico[]) => {
        this.servicos = servicos;
        this.servicosFiltrados = this.servicos;
      },
      error: (objectError: any) => {
        this.spinner.hide();
        this.toastr.error(objectError.error.resposta, 'Erro!')
      },
      complete: () => this.spinner.hide()
    });
  }

}
