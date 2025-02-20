import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateTimeFormatPipe } from 'src/app/helpers/DateTimeFormat.pipe';
import { MonthNames } from '../const/monthNames';
import { AgendamentoService } from 'src/app/services/agendamento.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss'],
  providers: [DateTimeFormatPipe],
  standalone: true,
  imports: [CommonModule]
})
export class CalendarioComponent implements OnInit {

  @Input() initialYear: number = new Date().getFullYear();
  @Input() initialMonth: number = new Date().getMonth() + 1;
  @Output() diaSelecionado: EventEmitter<Date> = new EventEmitter<Date>();

  private currentDate: Date;
  public markedDay: number | null = null;
  private diasComAgendamentos: number[] = []
  year: number;
  month: number;

  constructor(private agendamentoService: AgendamentoService,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService,
    private dateTimeFormatPipe: DateTimeFormatPipe) {
    this.currentDate = new Date(this.initialYear, this.initialMonth - 1, 1);
    this.year = this.currentDate.getFullYear();
    this.month = this.currentDate.getMonth() + 1;
  }

  ngOnInit() {
    this.goToToday();

    this.agendamentoService.metodoCalendario.subscribe(() => {
      this.getAllDiasComAgendamentos(this.month);
    });
  }

  get daysInMonth(): number[] {
    const days = new Date(this.year, this.month, 0).getDate();
    return Array.from({ length: days }, (_, index) => index + 1);
  }

  get monthYear(): string {
    return `${MonthNames.getMonthName(this.month)} ${this.year}`;
  }

  get dayOffsets(): number[] {
    const firstDayOffset = new Date(this.year, this.month - 1, 1).getDay();
    return Array.from({ length: firstDayOffset }, (_, index) => index);
  }

  dayHasEvent(day: number) {
    return this.diasComAgendamentos.find(x => x == day) != null
  }

  public navigateToPreviousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.year = this.currentDate.getFullYear();
    this.month = this.currentDate.getMonth() + 1;
    this.markedDay = null;
    this.getAllDiasComAgendamentos(this.month);
  }

  public navigateToNextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.year = this.currentDate.getFullYear();
    this.month = this.currentDate.getMonth() + 1;
    this.markedDay = null;
    this.getAllDiasComAgendamentos(this.month);
  }

  public goToToday() {
    const today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth() + 1;
    this.currentDate = today;
    this.getAllDiasComAgendamentos(this.month);
    this.onDayClick(today.getDate())
  }

  public onDayClick(day: number) {
    this.markedDay = day;
    this.diaSelecionado.emit(this.dateTimeFormatPipe.parseDate(new Date(this.year, this.month - 1 , this.markedDay ?? 0 )));
  }

  private async getAllDiasComAgendamentos(mes: number) {
    this.spinner.show();
    (await this.agendamentoService.getAllDiasComAgendamentos(mes)).subscribe({
      next: (diasComAgendamentos: number[]) => {
        this.diasComAgendamentos = diasComAgendamentos;
      },
      error: (objectError: any) => {
        this.spinner.hide();
        this.toastr.error(objectError.error.resposta, 'Erro!')
      },
      complete: () => this.spinner.hide()
    });
  }
}
