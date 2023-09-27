import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'PrecoFormat'
})
export class PrecoFormatPipe implements PipeTransform {
  transform(value: number | string): string {
    if (typeof value === 'string') {
      value = parseFloat(value);
    }

    if (isNaN(value)) {
      return 'R$ 0,00';
    }

    return 'R$ ' + value.toFixed(2).replace('.', ',');
  }

  parse(value: string): number {
    const cleanValue = value.replace('R$ ', '').replace(',', '.');
    return parseFloat(cleanValue);
  }
}
