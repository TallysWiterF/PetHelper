import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {

  @Input() initialYear: number = new Date().getFullYear();
  @Input() initialMonth: number = new Date().getMonth() + 1;

  private currentDate: Date;
  public markedDay: number | null = null;

  year: number;
  month: number;

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

    if(day == 2 || day == 25 || day == 14 ){
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
