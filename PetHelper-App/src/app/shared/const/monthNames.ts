export class MonthNames {

  private static Meses: string[] = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ];

  public static getMonthName(mes: number): string {
    return MonthNames.Meses[mes - 1];
  }

}
