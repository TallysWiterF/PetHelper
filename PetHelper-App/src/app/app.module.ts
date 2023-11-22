import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BodyComponent } from './components/body/body.component';
import { AgendamentoComponent } from './components/agendamento/agendamento.component';
import { ServicoComponent } from './components/servico/servico.component';
import { ServicoDetailComponent } from './components/servico/servico-detail/servico-detail.component';
import { LoginComponent } from './components/login/login.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { ClienteDetailComponent } from './components/cliente/cliente-detail/cliente-detail.component';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { ToastrModule } from 'ngx-toastr';
import { NgxMaskModule } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { SideNavComponent } from './shared/sidenav/sidenav.component';
import { CalendarioComponent } from './shared/calendario/calendario.component';

import { DateTimeFormatPipe } from './helpers/DateTimeFormat.pipe';
import { TelefoneFormatPipe } from './helpers/TelefoneFormat.pipe';
import { PrecoFormatPipe } from './helpers/PrecoFormat.pipe';
import { AgendamentoDetailComponent } from './components/agendamento/agendamento-detail/agendamento-detail.component';
import { AuthGuard } from './security/AuthGuard';
import { PetshopComponent } from './components/petshop/petshop.component';
import { PetshopDetailComponent } from './components/petshop/petshop-detail/petshop-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SideNavComponent,
    AgendamentoComponent,
    PetshopComponent,
    ClienteComponent,
    ServicoComponent,
    LoginComponent,
    CalendarioComponent,
    AgendamentoDetailComponent,
    PetshopDetailComponent,
    ClienteDetailComponent,
    ServicoDetailComponent,
    DateTimeFormatPipe,
    TelefoneFormatPipe,
    PrecoFormatPipe
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CollapseModule.forRoot(),
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    TabsModule.forRoot(),
    NgxMaskModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true
    }),
    NgxSpinnerModule,
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
  schemas: [],

})
export class AppModule { }
