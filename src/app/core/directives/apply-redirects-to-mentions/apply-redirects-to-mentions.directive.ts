import { AfterContentInit, Directive, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Directive({
  selector: '[lrApplyRedirectsToMentions]',
  standalone: true,
})
export class ApplyRedirectsToMentionsDirective implements AfterContentInit {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private offcanvas: NgbOffcanvas,
  ) { }

  ngAfterContentInit(): void {
    const element = this.el.nativeElement as HTMLElement;
    const mentions = element.querySelectorAll('span.mention[data-id]');
    mentions.forEach(m => {
      this.renderer.listen(m, 'click', () => {
        const userId = m.getAttribute('data-id');
        this.router.navigate(['/', 'main', 'people'], { queryParams: { userId } })
          .then(() => this.offcanvas.dismiss());
      });
    });
  }
}
