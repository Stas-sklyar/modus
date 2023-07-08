import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clipList',
  standalone: true,
})
export class ClipListPipe implements PipeTransform {
  transform<T>(value: T[] | null, sliceSize?: number): T[] {
    if (!value) return [] as T[];
    return value.slice(0, sliceSize) as T[];
  }
}
