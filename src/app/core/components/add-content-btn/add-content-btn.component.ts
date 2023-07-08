import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'lr-add-content-btn',
  templateUrl: './add-content-btn.component.html',
  styleUrls: ['./add-content-btn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AddContentBtnComponent {
  @Input() btnLabel: string = '';
}
