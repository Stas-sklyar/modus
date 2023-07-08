import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[lrAutoFocus]',
  standalone: true,
})
export class AutoFocusDirective implements OnInit {

  constructor(
    private el: ElementRef,
  ) { }

  ngOnInit(): void {
    this.el.nativeElement.focus();
  }
}
