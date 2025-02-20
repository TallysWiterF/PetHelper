import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { navbarData } from '../const/nav-data';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('350ms', style({ opacity: 0 })),
      ]),
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms', keyframes([
          style({ transform: 'rotate(0deg)', offset: 0 }),
          style({ transform: 'rotate(2turn)', offset: 1 }),
        ])),
      ]),
    ]),
  ],
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class SideNavComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;

  constructor(
    private autenticacaoService: AutenticacaoService,
    private router: Router
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  async sair(): Promise<void> {
    await this.router.navigate(['/agendamento']);
    this.autenticacaoService.setAutenticacao(false);
  }

  trackByFn(index: number, item: any): number {
    return index; // or item.id if available
  }
}
