import { Component, Inject, OnInit } from '@angular/core';
import { AutenticacaoService } from './services/autenticacao.service';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { PetshopComponent } from './components/petshop/petshop.component';
import { LoginComponent } from './components/login/login.component';
import { BodyComponent } from './components/body/body.component';
import { SideNavComponent } from './shared/sidenav/sidenav.component';
import { NgxSpinnerModule } from 'ngx-spinner';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    PetshopComponent,
    LoginComponent,
    SideNavComponent,
    BodyComponent,
    NgxSpinnerModule,
    RouterModule,
  ]
})
@Inject(AutenticacaoService)
@Inject(Router)
export class AppComponent implements OnInit {
  title = 'PetHelper-App';
  isSideNavCollapsed = false;
  screenWidth = 0;
  isAgendamentoCliente = false;

  constructor(private autenticacaoService: AutenticacaoService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url.startsWith('/petshop/')) {
          this.isAgendamentoCliente = true;
        } else {
          this.isAgendamentoCliente = false;
        }
      }
    });
  }

  public onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  public onLoginSuccess(): boolean {
    return this.autenticacaoService.isAutenticado
  }
}
