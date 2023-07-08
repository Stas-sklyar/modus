import { Pipe, PipeTransform } from '@angular/core';
import { UserActivityRecord } from '../../../models/interfaces';

@Pipe({
  name: 'clipActivityList',
  standalone: true,
})
export class ClipActivityListPipe implements PipeTransform {

  transform(
    value: UserActivityRecord[],
    partialOutput: boolean,
    portion: number,
  ): UserActivityRecord[] {
    if (!partialOutput) return value;
    return value.slice(0, portion);
  }
}
