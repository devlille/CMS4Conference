import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Component({
    selector: 'app-closed-form-warning-message',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePipe],
    template: `
    <p>
      Le formulaire n'est pas encore ouvert. Nous vous donnons rendez-vous le
      {{ date() | date: 'full' }}.
    </p>
  `
})
export class ClosedFormWarningMessageComponent {
  openingDate = input<Timestamp>();

  date = computed(() => {
    if (this.openingDate()) {
      return this.openingDate()?.toDate();
    }
    return '';
  });
}
