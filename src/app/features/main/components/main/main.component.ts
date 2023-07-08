import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lr-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  private _scrollLock = false;
  get scrollLock(): boolean {
    return this._scrollLock;
  }
  set scrollLock(value: boolean) {
    this._scrollLock = value;
  }

}
