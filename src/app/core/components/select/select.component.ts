import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'lr-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    BsDropdownModule,
    NgForOf,
    NgIf,
  ],
})
export class SelectComponent {
  @Input() list: any[] = [];
  @Input() itemLabel!: string;
  @Input() label!: string;
  @Output() toggleItemEvent = new EventEmitter();
  @Input() multiple = true;

  selectedItems: any[] = [];

  onToggleCheckboxes(item: any, $event: MouseEvent): void {
    let indexOfSelectedItem: number;

    if (this.itemLabel) {
      indexOfSelectedItem = this.selectedItems.findIndex(currentItem => currentItem[this.itemLabel].toLowerCase() === item[this.itemLabel].toLowerCase());
    } else {
      indexOfSelectedItem = this.selectedItems.findIndex(currentItem => currentItem.toLowerCase() === item.toLowerCase());
    }

    if (indexOfSelectedItem !== -1) {
      this.selectedItems.splice(indexOfSelectedItem, 1);
    } else {
      if (this.selectedItems.length > 0 && !this.multiple) {
        this.selectedItems = [];
        this.selectedItems.push(item);
        this.toggleItemEvent.emit(this.selectedItems);
        return;
      }
      this.selectedItems.push(item);
    }

    this.toggleItemEvent.emit(this.selectedItems);
  }

  isChecked(item: any): boolean {
    return this.selectedItems.findIndex(currentItem => currentItem === item) !== -1;
  }

  calcSelectedItemsString(): string {
    return this.selectedItems.map(item => item[this.itemLabel]).join(', ');
  }
}
