import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChipAvatar } from '../../../models/interfaces/chip-avatar';
import { CommonModule } from '@angular/common';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'div[lr-chip-avatar]',
  templateUrl: './chip-avatar.component.html',
  styleUrls: ['./chip-avatar.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ChipAvatarComponent {
  @Input() peopleData: ChipAvatar | null = null;
}
