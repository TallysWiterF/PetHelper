import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DateTimeFormatPipe } from 'src/app/helpers/DateTimeFormat.pipe';
import { Agendamento } from 'src/app/models/agendamento';
import { AgendamentoService } from 'src/app/services/agendamento.service';
import { AgendamentoDetailComponent } from './agendamento-detail/agendamento-detail.component';
import { Informativo } from 'src/app/models/informativo';

@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.component.html',
  styleUrls: ['./agendamento.component.scss'],
  providers: [AgendamentoService, DateTimeFormatPipe]
})
export class AgendamentoComponent implements OnInit {

  private _filtroLista: string = '';

  public agendamentos: Agendamento[] = [];
  public agendamentosFiltrados: Agendamento[] = [];
  private agendamentoId: number = 0;
  public activeModal?: NgbActiveModal;
  public dataSelecionada: Date = new Date();
  public informativo: Informativo = {
    totalAgendamentos: 0,
    porcentagemAgendamentos: '',
    totalServicos: 0,
    porcentagemServicos: '',
    totalRendimentos: 0,
    porcentagemRendimentos: '',
    totalClientes: 0,
    porcentagemClientes: '',
  };

  constructor(private agendamentoService: AgendamentoService,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService,
    private modalService: NgbModal,
    private dateTimeFormatPipe: DateTimeFormatPipe) { }

  ngOnInit() {
  }

  public get filtroLista() {
    return this._filtroLista
  }

  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.agendamentosFiltrados = this.filtroLista ? this.filtrarAgendamentos(this.filtroLista) : this.agendamentos;
  }

  public filtrarAgendamentos(filtroLista: string): Agendamento[] {
    filtroLista = filtroLista.toLocaleLowerCase();
    return this.agendamentos.filter((agendamento: Agendamento) => {
      return (
        agendamento.cliente.nome.toLocaleLowerCase().indexOf(filtroLista) !== -1 ||
        agendamento.cliente.endereco.toLocaleLowerCase().indexOf(filtroLista) !== -1 ||
        agendamento.servico.nome.toLocaleLowerCase().indexOf(filtroLista) !== -1
      );
    });
  }

  public novoAgendamento() {
    const cadastroModal = this.modalService.open(AgendamentoDetailComponent, { ariaLabelledBy: 'modal-basic-title', size: 'md', centered: true, keyboard: false });
    cadastroModal.componentInstance.title = "Cadastrar Agendamento";
    cadastroModal.componentInstance.agendamento.dataAgendamento = this.dataSelecionada;

    cadastroModal.result.then((result) => {
      this.getAllAgendamentos(this.dataSelecionada);
    }, (reason) => {
      this.getAllAgendamentos(this.dataSelecionada);
    });
  }

  public editarAgendamento(id: number) {
    const editarModal = this.modalService.open(AgendamentoDetailComponent, { ariaLabelledBy: 'modal-basic-title', size: 'md', centered: true, keyboard: false });
    editarModal.componentInstance.title = "Editar Agendamento";
    editarModal.componentInstance.agendamento = this.agendamentos.find(x => x.id == id);

    editarModal.result.then((result) => {
      this.getAllAgendamentos(this.dataSelecionada);
    }, (reason) => {
      this.getAllAgendamentos(this.dataSelecionada);
    });
  }

  public abrirTemplate(template: TemplateRef<any>, agendamentoId: number, event: Event): void {
    this.activeModal = this.modalService.open(template, { ariaLabelledBy: 'modal-basic-title', size: 'sm' });
    this.agendamentoId = agendamentoId;
    event.stopPropagation();
  }

  public fecharDeletarTemplate() {
    if (this.activeModal)
      this.activeModal.dismiss();
  }

  public abrirWhatsAppComMensagem(telefone: string ,event: Event) {
    window.open(`https://wa.me/${telefone}`, '_blank');
  }

  public async excluirAgendamento() {
    this.spinner.show();
    (await this.agendamentoService.deletarAgendamento(this.agendamentoId)).subscribe({
      next: (object: any) => {
        this.toastr.info(object.resposta, 'Aviso!');
        this.agendamentoService.metodoCalendario.emit();
        this.getAllAgendamentos(this.dataSelecionada);
      },
      error: (objectError: any) => {
        this.spinner.hide();
        this.toastr.error(objectError.error.resposta, 'Erro!')
      },
      complete: () => this.spinner.hide()
    });

    this.fecharDeletarTemplate();
  }

  public async getAllAgendamentos(dataSelecionada: Date) {
    this.dataSelecionada = dataSelecionada;
    this.spinner.show();
    (await this.agendamentoService.getAllAgendamentos(1, dataSelecionada)).subscribe({
      next: (agendamentos: Agendamento[]) => {
        this.agendamentosFiltrados = this.agendamentos = agendamentos;
      },
      error: (objectError: any) => {
        this.spinner.hide();
        this.toastr.error(objectError.error.resposta, 'Erro!')
      },
      complete: () => this.spinner.hide()
    });

    this.getInformativos();
  }

  private async getInformativos(){
    this.spinner.show();
    (await this.agendamentoService.getInformativos(1, this.dataSelecionada)).subscribe({
      next: (informativo: Informativo) => {
        this.informativo = informativo
      },
      error: (objectError: any) => {
        this.spinner.hide();
        this.toastr.error(objectError.error.resposta, 'Erro!')
      },
      complete: () => this.spinner.hide()
    });
  }
}
