import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Company, WorkflowStep } from '../../model/company';
import { FilesComponent } from '../files/files.component';
import { StorageService } from '../../storage.service';

@Component({
    selector: 'cms-communicated',
    imports: [CommonModule, FilesComponent],
    templateUrl: './communicated.component.html'
})
export class CommunicatedComponent {
  readonly company = input.required<Company>();
  readonly step = input.required<WorkflowStep>();

  files = {};

  private readonly storageService = inject(StorageService);

  ngOnInit() {
    this.storageService.getFlyers(this.company().id!).then((flyer) => {
      this.files = {
        Flyer: flyer,
      };
    });
  }
}
