import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lr-case-header',
  templateUrl: './case-header.component.html',
  styleUrls: ['./case-header.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CaseHeaderComponent {

  @Input() pageTitle = '';
  @Input() caseTitle = '';
  @Input() separated = false;
}
