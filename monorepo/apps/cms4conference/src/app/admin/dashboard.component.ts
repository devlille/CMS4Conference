import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { inject } from '@angular/core';

type Event = {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  installationDate: Date;
};

@Component({
  standalone: true,
  imports: [TableModule, DatePipe, CommonModule],
  selector: 'app-dashboard',
  template: `
    <p-table
      [value]="events"
      styleClass="p-datatable-striped"
      selectionMode="single"
      dataKey="id"
    >
      <ng-template pTemplate="header">
        <tr>
          <th>Name</th>
          <th>Date</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-event>
        <tr>
          <td>{{ event.name }}</td>
          <td>
            {{ event.startDate | date : 'dd/MM/yyyy' }} -
            {{ event.endDate | date : 'dd/MM/yyyy' }}
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class DashboardComponent {
  firestore = inject(Firestore);
  events: Event[] = [];
  events$ = collectionData(
    collection(this.firestore, 'events', 'devlille', 'editions'),
    { idField: 'uid' }
  ).subscribe((data) => {
    this.events = data.map((d) => ({
      ...d,
      startDate: d['startDate'] ? d['startDate'].toDate() : null,
      endDate: d['endDate'] ? d['endDate'].toDate() : null,
      installationDate: d['installationDate']
        ? d['installationDate'].toDate()
        : null,
    })) as Event[];
  });
}
