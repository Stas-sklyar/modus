import { Pipe, PipeTransform } from '@angular/core';
import TimeAgo from 'javascript-time-ago';

@Pipe({
  name: 'timeAgo',
  standalone: true,
})
export class TimeAgoPipe implements PipeTransform {
  timeAgo = new TimeAgo('en-US');

  transform(date: string): string {
    return this.timeAgo.format(new Date(date));
  }
}
