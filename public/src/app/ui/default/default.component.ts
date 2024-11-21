import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowStep } from '../../model/company';

@Component({
    selector: 'cms-default',
    imports: [CommonModule],
    templateUrl: './default.component.html'
})
export class DefaultComponent {
  readonly step = input<WorkflowStep>();
}
