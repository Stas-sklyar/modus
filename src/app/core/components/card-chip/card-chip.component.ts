import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CardChipType } from '../../../models/enums/card-chip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lr-card-chip',
  templateUrl: './card-chip.component.html',
  styleUrls: ['./card-chip.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CardChipComponent {
  @Input() cardChipType: CardChipType | null = CardChipType.DOCUMENT;
  @Input() value: number = 0;
}
