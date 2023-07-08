import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TrialCaseCard } from '../../../../models/interfaces/trial-case-card';

@Component({
  selector: 'lr-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  @Input() card!: TrialCaseCard;
}
