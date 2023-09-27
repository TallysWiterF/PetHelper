import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServicoComponent } from 'src/app/components/servico/servico.component';
import { PrecoFormatPipe } from 'src/app/helpers/PrecoFormat.pipe';
import { Servico } from 'src/app/models/servico';
import { ServicoService } from 'src/app/services/servico.service';

@Component({
  selector: 'app-servico-detail',
  templateUrl: './servico-detail.component.html',
  styleUrls: ['./servico-detail.component.scss'],
  providers: [ServicoService, PrecoFormatPipe]
})
export class ServicoDetailComponent implements OnInit {

  @Input() isOpen: boolean = true;
  @Input() title: string = 'Modal';
  @Input() ServicoComponent?: ServicoComponent;
  @Input() public servico: Servico = {
    id: 0,
    petShopId: 1,
    nome: '',
    descricao: '',
    preco: 0,
    ativo: true
  };

  public precoFormatado: string = this.precoFormatPipe.transform(this.servico.preco);
  form: FormGroup = this.formBuilder.group({});

  constructor(private servicoService: ServicoService,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private precoFormatPipe: PrecoFormatPipe) { }

  ngOnInit() {
    this.atualizarValorFormatado();
    this.inicializarFormulario();
  }

  get controls(): any {
    return this.form.controls;
  }

  private inicializarFormulario(): void {
    this.form = this.formBuilder.group({
      nome: [this.servico.nome, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      preco:[this.precoFormatado],
      descricao: [this.servico.descricao, Validators.maxLength(100)],
    });
  }

  private atualizarValorFormatado() {
    this.precoFormatado = this.precoFormatPipe.transform(this.servico.preco);
  }

  // Método para atualizar o valor numérico quando salvar o serviço
  private atualizarValorNumerico() {
    this.servico.preco = this.precoFormatPipe.parse(this.precoFormatado);
  }

  public imagemChange(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.servico.logoServico = e.target.result; // contém a imagem como uma string base64;
      };
      reader.readAsDataURL(file);
    }
  }

  public abrirSeletorArquivo() {
    document.getElementById('fileInput')?.click();
  }

  public fecharModal() {
    this.activeModal.dismiss();
  }

  public async salvarServico() {
    this.atualizarValorNumerico();
    this.ServicoComponent?.spinner.show();
    this.servico.id != 0 ? this.editarServico() : this.adicionarServico();
  }

  private async adicionarServico() {
    (await this.servicoService.adicionarServico(this.servico)).subscribe({
      next: (object: any) => {
        this.ServicoComponent?.toastr.success(object.resposta, 'Sucesso');
        this.fecharModal();
      },
      error: (objectError: any) => {
        this.ServicoComponent?.spinner.hide();
        this.ServicoComponent?.toastr.error(objectError.error.resposta, 'Erro!');
      },
      complete: () => this.ServicoComponent?.spinner.hide()
    });
  }

  private async editarServico() {
    (await this.servicoService.editarServico(this.servico)).subscribe({
      next: (object: any) => {
        this.ServicoComponent?.toastr.success(object.resposta, 'Sucesso');
        this.fecharModal();
      },
      error: (objectError: any) => {
        this.ServicoComponent?.spinner.hide();
        this.ServicoComponent?.toastr.error(objectError.error.resposta, 'Erro!');
      },
      complete: () => this.ServicoComponent?.spinner.hide()
    });
  }
}
