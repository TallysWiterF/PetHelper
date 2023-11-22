import { Component, OnInit } from '@angular/core';
import { AutenticacaoService } from './services/autenticacao.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'PetHelper-App';
  isSideNavCollapsed = false;
  screenWidth = 0;
  isAgendamentoCliente = false;

  constructor(private autenticacaoService: AutenticacaoService,
    private router: Router,
    private route: ActivatedRoute) { }

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
