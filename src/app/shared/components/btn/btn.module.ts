import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnComponent } from './btn.component';
import { IcBtnComponent } from './ic-btn.component';

@NgModule({
  declarations: [
    BtnComponent,
    IcBtnComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    BtnComponent,
    IcBtnComponent,
  ],
})
export class BtnModule { }
