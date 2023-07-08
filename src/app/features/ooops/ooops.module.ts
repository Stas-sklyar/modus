import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ServerErrorComponent } from './components/server-error/server-error.component';
import { UnavailablePageComponent } from './components/unavailable-page/unavailable-page.component';
import { OoopsRoutingModule } from './ooops-routing.module';


@NgModule({
  declarations: [
    UnavailablePageComponent,
    ServerErrorComponent,
  ],
  imports: [
    CommonModule,
    OoopsRoutingModule,
  ],
  exports: [
    ServerErrorComponent,
  ],
})
export class OoopsModule { }
