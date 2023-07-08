import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { SortDirection } from '../../../models/aliases/sort-direction';
import { TableSortEvent } from '../../../models/interfaces/table-sort-event';

const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

@Directive({
  selector: '[lrSortableHeader]',
  standalone: true,
})
export class SortableHeaderDirective {
  @Input('lrSortableHeader') column = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<TableSortEvent>();

  @HostListener('click')
  rotate(): void {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.column, direction: this.direction });
  }

  @HostBinding('class.asc')
  get isAscending(): boolean {
    return this.direction === 'asc';
  }

  @HostBinding('class.desc')
  get isDescending(): boolean {
    return this.direction === 'desc';
  }
}
