import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideNavComponent } from './shared/sidenav/sidenav.component';
import { BodyComponent } from './components/body/body.component';
import { HomeComponent } from './components/home/home.component';
import { ServicosComponent } from './components/servicos/servicos.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarioComponent } from './shared/calendario/calendario.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { NgbCalendar, NgbCalendarGregorian } from '@ng-bootstrap/ng-bootstrap';
import { ClienteDetailComponent } from './shared/cliente-detail/cliente-detail.component';

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
    ClienteDetailComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [{
    provide: NgbCalendar, useClass: NgbCalendarGregorian}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
