import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Document } from '../../../../models/interfaces/document';

@Component({
  selector: 'lr-exhibit-card',
  templateUrl: './exhibit-card.component.html',
  styleUrls: ['./exhibit-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExhibitCardComponent {
  @Input() document!: Document;
  @Input() index!: number;
}
