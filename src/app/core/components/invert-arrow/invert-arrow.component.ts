import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lr-invert-arrow',
  templateUrl: './invert-arrow.component.html',
  styleUrls: ['./invert-arrow.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class InvertArrowComponent {

  private _isInverted = false;
  @Input() set isInverted(state: boolean | null) {
    this._isInverted = !!state;
  }
  get isInverted(): boolean {
    return this._isInverted;
  }

}
