import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getObjKeys',
  standalone: true,
})
export class GetObjKeysPipe implements PipeTransform {

  transform(
    value: object,
  ): string[] {
    return Object.keys(value);
  }

}
