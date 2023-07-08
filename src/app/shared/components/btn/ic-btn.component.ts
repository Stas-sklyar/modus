import { Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { BUTTON_ICONS } from '../../../models/aliases/app-btn-icons.type';

const HOST_SELECTOR_CLASSES: { selector: string; classes: string[] }[] = [
  {
    selector: 'lr-ic-btn',
    classes: ['ic-btn'],
  },
  {
    selector: 'lr-ic-btn-dropdown',
    classes: ['ic-btn', 'ic-btn_dropdown'],
  },
  {
    selector: 'lr-btn-nav-primary',
    classes: ['nav-btn', 'nav-btn_primary'],
  },
  {
    selector: 'lr-btn-nav-secondary',
    classes: ['nav-btn', 'nav-btn_secondary'],
  },
];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[lr-ic-btn], button[lr-ic-btn-dropdown], a[lr-btn-nav-primary], a[lr-btn-nav-secondary]',
  templateUrl: './ic-btn.component.html',
  styleUrls: ['./ic-btn.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IcBtnComponent {

  @Input() icon: BUTTON_ICONS | null = null;

  constructor(
    private elementRef: ElementRef,
  ) {

    const classList = (elementRef.nativeElement as HTMLElement).classList;

    for (const pair of HOST_SELECTOR_CLASSES) {
      if (this.hasHostAttributes(pair.selector)) {
        pair.classes.forEach((className: string) => {
          classList.add(className);
        });
      }
    }
  }

  hasHostAttributes(...attributes: string[]): boolean {
    return attributes.some(attribute => this.elementRef.nativeElement.hasAttribute(attribute));
  }
}
