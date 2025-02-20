import { Component, OnInit, Inject, Renderer2, EventEmitter, Output } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { PetShop } from 'src/app/models/petshop';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from 'src/app/models/login';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { Inscricao } from 'src/app/models/inscricao';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgxMaskDirective } from 'ngx-mask';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports:[ReactiveFormsModule, CommonModule, TypeaheadModule, TooltipModule, NgxMaskDirective],
})
export class LoginComponent implements OnInit {

  @Output() loginSuccess = new EventEmitter<boolean>();

  public realizouLogin: boolean = false;
  public login: Login = {
    email: '',
    senha: ''
  }

  public inscricao: Inscricao = {
    proprietario: '',
    email: '',
    nomePetShop: '',
    telefone: '',
  }

  public formLogin: FormGroup = this.formBuilder.group({});
  public formInscricao: FormGroup = this.formBuilder.group({});

  constructor(
    private _renderer2: Renderer2,
    private formBuilder: FormBuilder,
    @Inject(DOCUMENT) private _document: Document,
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService,
    private autenticacaoService: AutenticacaoService
  ) { }

  ngOnInit() {

    let script = this._renderer2.createElement('script');

    script.text = `
        const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');
        const container = document.getElementById('container');

        signUpButton.addEventListener('click', () => {
          container.classList.add("right-panel-active");
        });

        signInButton.addEventListener('click', () => {
          container.classList.remove("right-panel-active");
        });
        `;

    this._renderer2.appendChild(this._document.body, script);
    this.inicializarFormulario()
  }

  get controlsLogin(): any {
    return this.formLogin.controls;
  }

  get controlsInscricao(): any{
    return this.formInscricao.controls;
  }

  public limparControles() {
    Object.keys(this.formLogin.controls).forEach(controlName => {
      const control = this.formLogin.controls[controlName];
      control.setValue('');
      control.markAsPristine();
      control.markAsUntouched();
    });

    Object.keys(this.formInscricao.controls).forEach(controlName => {
      const control = this.formInscricao.controls[controlName];
      control.setValue('');
      control.markAsPristine();
      control.markAsUntouched();
    });
  }

  private inicializarFormulario() {
    this.formLogin = this.formBuilder.group({
      email: [this.login.email, [Validators.required, Validators.email]],
      senha: [this.login.senha, [Validators.required]]
    });

    this.formInscricao = this.formBuilder.group({
      proprietario:  [this.inscricao.proprietario, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: [this.inscricao.email, [Validators.required,  Validators.email]],
      nomePetShop:  [this.inscricao.proprietario, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      telefone: [this.inscricao.telefone, [Validators.required, Validators.minLength(11)]],
    })
  }

  public async realizarLogin() {
    (await this.loginService.realizarLogin(this.login)).subscribe({
      next: (petshop: PetShop) => {
        this.autenticacaoService.setAutenticacao(true, petshop);
        this.loginSuccess.emit(true);
        window.location.reload();
      },
      error: (objectError: any) => {
        this.toastr.error("Ocorreu um erro ao realizar o login: " + objectError.error.resposta, 'Ocorreu um erro!')
      }
    });
  }


  public async realizarInscricao() {
    (await this.loginService.realizarInscricao(this.inscricao)).subscribe({
      next: (object: any) => {
        this.toastr.success(object.resposta, 'Sucesso');
      },
      error: (objectError: any) => {
        this.toastr.error("Ocorreu um erro ao realizar a inscrição: " + objectError.error.resposta, 'Ocorreu um erro!')
      }
    });
  }
}
