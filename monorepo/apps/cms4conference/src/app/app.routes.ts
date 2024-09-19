import { Route } from '@angular/router';
import { DashboardComponent } from './admin/dashboard.component';
import { AuthGuard } from '@angular/fire/auth-guard';

export const appRoutes: Route[] = [
  {
    path: 'admin',
    component: DashboardComponent,
  },
];
