import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AgendamentoComponent } from './components/agendamento/agendamento.component';
import { PetshopComponent } from './components/petshop/petshop.component';
import { EstoqueComponent } from './components/estoque/estoque.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { ServicoComponent } from './components/servico/servico.component';
import { AuthGuard } from './security/AuthGuard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'agendamento', component: AgendamentoComponent, canActivate: [AuthGuard] },
  { path: 'petshop/:id', component: PetshopComponent, pathMatch: 'full' },
  { path: 'estoque', component: EstoqueComponent, canActivate: [AuthGuard] },
  { path: 'cliente', component: ClienteComponent, canActivate: [AuthGuard] },
  { path: 'servicos', component: ServicoComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'agendamento', pathMatch: 'full' },
  { path: '**', redirectTo: 'agendamento' },
];
