import { Component, OnInit, Input } from '@angular/core';
import { Agendamento } from 'src/app/models/agendamento';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @Input() initialYear: number = new Date().getFullYear();
  @Input() initialMonth: number = new Date().getMonth() + 1;

  private currentDate: Date;
  public markedDay: number | null = null;
  public year: number;
  public month: number;

  public agendamentos: Agendamento[] = [
    {
      cliente: "João",
      telefone: "(123) 456-7890",
      endereco: "Rua A, 123",
      servico: "Banho e Tosa",
      horario: "08:00 - 09:00",
      status: "Em rota de entrega",
    },
    {
      cliente: "Maria",
      telefone: "(987) 654-3210",
      endereco: "Avenida B, 456",
      servico: "Tosa",
      horario: "10:00 - 11:00",
      status: "Em andamento",
    },
    {
      cliente: "Carlos",
      telefone: "(555) 123-4567",
      endereco: "Praça C, 789",
      servico: "Banho",
      horario: "12:00 - 13:00",
      status: "Em rota de busca",
    },
    {
      cliente: "Ana",
      telefone: "(111) 222-3333",
      endereco: "Rua D, 987",
      servico: "Banho, Tosa e vermífugo",
      horario: "14:00 - 15:00",
      status: "Aguardando",
    },
    {
      cliente: "Pedro",
      telefone: "(444) 555-6666",
      endereco: "Avenida E, 789",
      servico: "Banho e Tosa",
      horario: "15:00 - 16:00",
      status: "Aguardando",
    },
    {
      cliente: "Antonio",
      telefone: "(222) 333-4444",
      endereco: "Rua Spx, 444",
      servico: "Banho e Tosa",
      horario: "16:00 - 17:00",
      status: "Aguardando",
    },
    {
      cliente: "Marcos",
      telefone: "(222) 111-9999",
      endereco: "Rua Camapuan, 789",
      servico: "Banho",
      horario: "17:00 - 18:00",
      status: "Aguardando",
    },
  ];

  constructor() {
    this.currentDate = new Date(this.initialYear, this.initialMonth - 1, 1);
    this.year = this.currentDate.getFullYear();
    this.month = this.currentDate.getMonth() + 1;
  }

  ngOnInit() {
    this.goToToday();
  }

  get daysInMonth(): number[] {
    const days = new Date(this.year, this.month, 0).getDate();
    return Array.from({ length: days }, (_, index) => index + 1);
  }

  get monthYear(): string {
    return `${this.getMonthName(this.month)} ${this.year}`;
  }

  get dayOffsets(): number[] {
    const firstDayOffset = new Date(this.year, this.month - 1, 1).getDay();
    return Array.from({ length: firstDayOffset }, (_, index) => index);
  }

  dayHasEvent(day: number) {

    if(day == 2){
      return true;
    }
    return false;
  }

  private getMonthName(month: number): string {
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril',
      'Maio', 'Junho', 'Julho', 'Agosto',
      'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return monthNames[month - 1];
  }

  navigateToPreviousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.year = this.currentDate.getFullYear();
    this.month = this.currentDate.getMonth() + 1;
    this.markedDay = null;
  }

  navigateToNextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.year = this.currentDate.getFullYear();
    this.month = this.currentDate.getMonth() + 1;
    this.markedDay = null;
  }

  goToToday() {
    const today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth() + 1;
    this.currentDate = today;

    this.markedDay = today.getDate(); // Marque o dia de hoje
  }

  onDayClick(day: number) {
    if (this.markedDay === day) {
      this.markedDay = null; // Se o mesmo dia for clicado novamente, desmarque-o
    } else {
      this.markedDay = day;
    }
  }
}
