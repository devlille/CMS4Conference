import { Component } from '@angular/core';

@Component({
  selector: 'cms-filled',
  imports: [],
  template: ` <p>{{ message }}</p> `
})
export class FilledComponent {
  message = 'Nous avons bien pris en compte votre souhait de devenir partenaire et nous vous en remercions.';
}
