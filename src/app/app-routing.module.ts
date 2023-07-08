import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './core/guards/login/login.guard';
import { AppRoutes } from './models/enums/app-routes';

const routes: Routes = [
  {
    path: AppRoutes.EMPTY,
    redirectTo: AppRoutes.MAIN,
    pathMatch: 'full',
  },
  {
    path: AppRoutes.MAIN,
    canActivate: [LoginGuard],
    loadChildren: () => import('./features/main/main.module').then(m => m.MainModule),
  },
  {
    path: AppRoutes.LOGIN,
    loadChildren: () => import('./features/login/login.module').then(m => m.LoginModule),
  },
  {
    path: AppRoutes.CASE,
    canActivate: [LoginGuard],
    loadChildren: () => import('./features/workspace/workspace.module').then(m => m.WorkspaceModule),
  },
  {
    path: AppRoutes.OOOPS,
    loadChildren: () => import('./features/ooops/ooops.module').then(m => m.OoopsModule),
  },
  {
    path: AppRoutes.REGISTER_ADMIN,
    loadComponent: () => import('./features/register-admin/register-admin.component').then(c => c.RegisterAdminComponent),
  },
  {
    path: AppRoutes.REGISTER_USER,
    loadComponent: () => import('./features/register-user/register-user.component').then(c => c.RegisterUserComponent),
  },
  {
    path: '**',
    redirectTo: AppRoutes.OOOPS,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
