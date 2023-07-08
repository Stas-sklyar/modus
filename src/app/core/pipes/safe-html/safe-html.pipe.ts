import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(
    private domSanitizer: DomSanitizer,
  ) {}

  transform(value: string | null): SafeHtml {
    if (!value) return '';
    return this.domSanitizer.bypassSecurityTrustHtml(value);
  }
}
