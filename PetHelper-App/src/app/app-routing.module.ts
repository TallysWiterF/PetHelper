import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgendamentoComponent } from './components/agendamento/agendamento.component';
import { EstoqueComponent } from './components/estoque/estoque.component';
import { ServicoComponent } from './components/servico/servico.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'agendamento', component: AgendamentoComponent },
  { path: 'estoque', component: EstoqueComponent },
  { path: 'cliente', component: ClienteComponent },
  { path: 'servicos', component: ServicoComponent },
  { path: '', redirectTo: 'agendamento', pathMatch: 'full' },
  { path: '**', redirectTo: 'agendamento' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
