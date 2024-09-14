import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowStep } from '../../model/company';

@Component({
  selector: 'cms-default',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './default.component.html',
})
export class DefaultComponent {
  @Input()
  step: WorkflowStep | undefined;
}
