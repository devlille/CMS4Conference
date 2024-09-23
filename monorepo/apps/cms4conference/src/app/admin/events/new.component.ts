import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  imports: [
    CalendarModule,
    FloatLabelModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
  ],
  selector: 'app-events-new',
  template: `
    <form [formGroup]="formGroup" (submit)="onSubmit()">
      <p-floatLabel>
        <input pInputText formControlName="name" id="name" />
        <label for="name">Nom</label>
      </p-floatLabel>
      <p-floatLabel>
        <p-calendar formControlName="startDate" inputId="start_date" />
        <label for="start_date">Date de Début</label>
      </p-floatLabel>
      <p-floatLabel>
        <p-calendar formControlName="endDate" inputId="end_date" />
        <label for="end_date">Date de Fin</label>
      </p-floatLabel>
      <p-floatLabel>
        <p-calendar
          formControlName="installingDate"
          inputId="installing_date"
        />
        <label for="installing_date">Date d'installation</label>
      </p-floatLabel>
      <p-button label="Valider" type="submit" />
    </form>
  `,
})
export class EventsNewComponent {
  firestore = inject(Firestore);
  router = inject(Router);

  formGroup: FormGroup = new FormGroup({
    name: new FormControl<string | null>(null),
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
    installingDate: new FormControl<Date | null>(null),
  });

  onSubmit() {
    addDoc(
      collection(this.firestore, 'events', 'devlille', 'editions'),
      this.formGroup.value
    ).then(() => {
      this.router.navigate(['/admin']);
    });
  }
}
