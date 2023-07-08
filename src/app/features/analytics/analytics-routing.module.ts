import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsRoutes } from '../../models/enums/analytics-routes';
import { AnalyticsComponent } from './components/analytics/analytics.component';

const routes: Routes = [
  {
    path: AnalyticsRoutes.ENTRY,
    component: AnalyticsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalyticsRoutingModule { }
