import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getInitials',
  standalone: true,
})
export class GetInitialsPipe implements PipeTransform {

  transform(fullName: string): string {
    return fullName
      .split(' ')
      .slice(0, 2)
      .reduce((initials, nameSegment) => {
        return initials + nameSegment.slice(0, 1);
      }, '');
  }

}
