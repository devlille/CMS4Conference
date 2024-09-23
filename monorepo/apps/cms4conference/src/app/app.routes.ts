import { Route } from '@angular/router';
import { DashboardComponent } from './admin/dashboard.component';
import { EventsNewComponent } from './admin/events/new.component';
import { EventDashboardComponent } from './admin/events/event.dashboard.component';

export const appRoutes: Route[] = [
  {
    path: 'admin',
    component: DashboardComponent,
  },
  {
    path: 'admin/events/new',
    component: EventsNewComponent,
  },
  {
    path: 'admin/events/:id',
    component: EventDashboardComponent,
  },
];
