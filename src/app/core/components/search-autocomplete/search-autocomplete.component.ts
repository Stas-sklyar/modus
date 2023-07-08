import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lr-search-autocomplete',
  templateUrl: './search-autocomplete.component.html',
  styleUrls: ['./search-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SearchAutocompleteComponent {
  @Input() placeholder!: string;
  @Output() searchQueryChangeEvent = new EventEmitter<string>();

  onSearchQueryChange(event: Event): void {
    const targetElem = event.target as HTMLInputElement;

    if (targetElem) {
      this.searchQueryChangeEvent.emit(targetElem.value);
    }
  }
}
