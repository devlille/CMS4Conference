import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';

import { Company, WorkflowStep } from '../../model/company';
import { StorageService } from '../../storage.service';
import { FilesComponent } from '../files/files.component';

@Component({
  selector: 'cms-communicated',
  imports: [CommonModule, FilesComponent],
  templateUrl: './communicated.component.html'
})
export class CommunicatedComponent {
  readonly company = input.required<Company>();
  readonly step = input.required<WorkflowStep>();

  stepSignal = computed(() => this.step as unknown as WorkflowStep);
  companySignal = computed(() => this.company as unknown as Company);

  files = signal({});

  private readonly storageService = inject(StorageService);

  ngOnInit() {
    this.storageService.getFlyers(this.companySignal().id!).then((flyer) => {
      this.files.set({
        Flyer: flyer
      });
    });
  }
}
