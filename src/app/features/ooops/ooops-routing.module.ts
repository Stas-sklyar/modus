import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OoopsRoutes } from '../../models/enums/ooops-routes';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { UnavailablePageComponent } from './components/unavailable-page/unavailable-page.component';

const routes: Routes = [
  {
    path: OoopsRoutes.ENTRY,
    component: UnavailablePageComponent,
    children: [
      {
        path: OoopsRoutes.SERVER_ERROR,
        component: ServerErrorComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OoopsRoutingModule { }
