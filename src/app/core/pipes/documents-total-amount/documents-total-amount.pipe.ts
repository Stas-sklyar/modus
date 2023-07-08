import { Pipe, PipeTransform } from '@angular/core';
import { WithCounters } from '../../../models/interfaces/withCounters';
import { DocumentFolder } from '../../../models/interfaces/document-folder';

@Pipe({
  name: 'documentsTotalAmount',
  standalone: true,
})
export class DocumentsTotalAmountPipe implements PipeTransform {

  transform(value: (DocumentFolder & WithCounters)[] | null): number {
    if (!value) return 0;

    return value.reduce((acc, curr) => {
      return acc + curr['documents@odata.count'];
    }, 0);
  }

}
