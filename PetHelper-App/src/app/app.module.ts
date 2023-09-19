import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BodyComponent } from './components/body/body.component';
import { HomeComponent } from './components/home/home.component';
import { ServicosComponent } from './components/servicos/servicos.component';
import { LoginComponent } from './components/login/login.component';
import { ClienteComponent } from './components/cliente/cliente.component';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastrModule } from 'ngx-toastr';
import { NgxMaskModule } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';

import { SideNavComponent } from './shared/sidenav/sidenav.component';
import { CalendarioComponent } from './shared/calendario/calendario.component';
import { ClienteDetailComponent } from './shared/cliente-detail/cliente-detail.component';

import { DateTimeFormatPipe } from './helpers/DateTimeFormat.pipe';
import { TelefoneFormatPipe } from './helpers/TelefoneFormat.pipe';
import { PrecoFormatPipe } from './helpers/PrecoFormat.pipe';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SideNavComponent,
    ClienteComponent,
    HomeComponent,
    ServicosComponent,
    LoginComponent,
    CalendarioComponent,
    ClienteDetailComponent,
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
    NgxMaskModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true
    }),
    NgxSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas:[],

})
export class AppModule { }
