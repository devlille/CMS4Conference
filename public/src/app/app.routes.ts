import { Routes } from '@angular/router';

// TODO add guard
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./register-form/register-form.component').then((mod) => mod.RegisterFormComponent)
  },
  {
    path: 'partner/:id',
    loadComponent: () => import('./ui/partner/partner.component').then((mod) => mod.PartnerComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./private-dashboard/dashboard/dashboard.component').then((mod) => mod.DashboardComponent)
  },
  {
    path: 'admin/partner/:id',
    loadComponent: () => import('./ui/partner/partner.component').then((mod) => mod.PartnerComponent)
  }
];
