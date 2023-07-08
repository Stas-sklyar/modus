import { SortDirection } from '../aliases/sort-direction';

export interface TableSortEvent {
  column: string;
  direction: SortDirection;
}
