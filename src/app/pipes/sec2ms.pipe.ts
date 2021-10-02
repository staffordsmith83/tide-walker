import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sec2ms'
})
export class Sec2msPipe implements PipeTransform {


  transform(seconds: number): number {

    return seconds * 1000;

  }
}