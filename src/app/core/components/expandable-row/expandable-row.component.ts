import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnModule } from '../../../shared/components/btn/btn.module';
import { InvertArrowComponent } from '../invert-arrow/invert-arrow.component';

@Component({
  selector: 'lr-expandable-row',
  standalone: true,
  imports: [CommonModule, InvertArrowComponent, BtnModule],
  templateUrl: './expandable-row.component.html',
  styleUrls: ['./expandable-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandableRowComponent {
  @Input() title = 'Title';
  @Input() isExpanded: boolean | null = false;
}
