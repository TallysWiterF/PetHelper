import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EstoqueComponent } from './components/estoque/estoque.component';
import { ServicosComponent } from './components/servicos/servicos.component';
import { ClienteComponent } from './components/cliente/cliente.component';

const routes: Routes = [

  {path: 'home', component: HomeComponent},
  {path: 'estoque', component: EstoqueComponent},
  {path: 'cliente', component: ClienteComponent},
  {path: 'servicos', component: ServicosComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
