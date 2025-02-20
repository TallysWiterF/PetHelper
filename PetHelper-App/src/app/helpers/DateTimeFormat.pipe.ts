import { DatePipe } from '@angular/common';
import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../util/Constants';

@Pipe({
  name: 'DateTimeFormat',
  standalone: true
})

@Injectable({
  providedIn: 'root'
})

export class DateTimeFormatPipe extends DatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return super.transform(value, Constants.DATE_FMT);
  }

  parseDate(dataOriginal: Date): any {
    return super.transform(dataOriginal, Constants.DATE_FMT_US);
  }
}
