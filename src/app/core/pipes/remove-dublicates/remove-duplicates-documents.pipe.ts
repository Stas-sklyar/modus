import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeDuplicatesDocuments',
  standalone: true,
})
export class RemoveDuplicatesDocumentsPipe implements PipeTransform {

  transform(arr: any[]): any[] {
    return arr.filter((value, i, array) => array.findIndex(value2 => (value2.documentId === value.documentId)) === i);
  }

}
