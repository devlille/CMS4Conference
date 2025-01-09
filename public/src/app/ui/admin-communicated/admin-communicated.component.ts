import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Workflow, WorkflowStep, Company, State } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { StorageService } from '../../storage.service';
import { FilesComponent } from '../files/files.component';
import { UploadComponent } from '../upload/upload.component';

@Component({
  selector: 'cms-admin-communicated',
  imports: [CommonModule, FilesComponent, UploadComponent, MatInputModule, FormsModule, MatFormFieldModule, MatButtonModule, MatIconModule],
  templateUrl: './admin-communicated.component.html'
})
export class AdminCommunicatedComponent {
  readonly workflow = input.required<Workflow>();
  readonly step = input.required<WorkflowStep>();
  readonly company = input.required<Company>();
  readonly id = input.required<string>();

  idSignal = computed(() => this.id as unknown as string);
  stepSignal = computed(() => this.step as unknown as WorkflowStep);
  workflowSignal = computed(() => this.workflow as unknown as Workflow);
  companySignal = computed(() => this.company as unknown as Company);

  files = signal({});

  private readonly partnerService = inject(PartnerService);
  private readonly storageService = inject(StorageService);

  setDate() {
    this.partnerService.update(this.idSignal(), {
      publicationDate: this.companySignal().publicationDate
    });
  }
  uploadFlyer(file: Blob) {
    this.storageService.uploadFile(this.idSignal(), file, 'flyers').then((url) => {
      this.partnerService.update(this.idSignal(), {
        flyerUrl: url
      });
    });
  }

  ngOnInit() {
    this.storageService.getFlyers(this.idSignal()).then((flyer) => {
      this.files.set({
        Flyer: flyer
      });
    });
  }

  updateStatus(status: State) {
    this.partnerService.update(this.idSignal(), {
      status: {
        ...this.companySignal().status,
        [this.stepSignal().key]: status
      }
    });
  }
  setDone() {
    this.updateStatus('done');
  }
}
