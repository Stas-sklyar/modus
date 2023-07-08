import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainRoutes } from '../../models/enums/main-routes';
import { MainComponent } from './components/main/main.component';

const routes: Routes = [
  {
    path: MainRoutes.EMPTY,
    component: MainComponent,
    children: [
      {
        path: MainRoutes.DASHBOARD,
        loadComponent: () => import('./components/dashboard/dashboard.component').then(c => c.DashboardComponent),
      },
      {
        path: MainRoutes.CASES,
        loadComponent: () => import('./components/trial-cases/trial-cases.component').then(c => c.TrialCasesComponent),
      },
      {
        path: MainRoutes.PARTICIPANTS,
        loadComponent: () => import('./components/participants/participants.component').then(c => c.ParticipantsComponent),
      },
      {
        path: MainRoutes.TASKS,
        loadComponent: () => import('./components/current-user-tasks/current-user-tasks').then(c => c.CurrentUserTasks),
      },
      {
        path: '**',
        redirectTo: MainRoutes.DASHBOARD,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule { }
