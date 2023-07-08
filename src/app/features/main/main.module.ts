import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './components/main/main.component';
import { AppTopMenuComponent } from '../app-top-menu/app-top-menu.component';
import { AsidePanelComponent } from '../../core/components/aside-panel/aside-panel.component';


@NgModule({
  declarations: [
    MainComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    AppTopMenuComponent,
    AsidePanelComponent,
  ],
})
export class MainModule { }
