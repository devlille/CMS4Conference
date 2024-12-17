import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Workflow, WorkflowStep, Company, State } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { StorageService } from '../../storage.service';
import { FilesComponent } from '../files/files.component';
import { UploadComponent } from '../upload/upload.component';

@Component({
  selector: 'cms-admin-paid',
  imports: [CommonModule, MatButtonModule, FilesComponent, UploadComponent, MatIconModule],
  templateUrl: './admin-paid.component.html'
})
export class AdminPaidComponent {
  readonly workflow = input.required<Workflow>();
  readonly step = input.required<WorkflowStep>();
  readonly company = input.required<Company>();
  readonly id = input.required<string>();
  files = {};

  idSignal = computed(() => this.id as unknown as string);
  stepSignal = computed(() => this.step as unknown as WorkflowStep);
  companySignal = computed(() => this.company as unknown as Company);

  private readonly partnerService = inject(PartnerService);
  private readonly storageService = inject(StorageService);

  ngOnInit() {
    this.storageService.getInvoice(this.idSignal()).then((invoice) => {
      this.files = {
        Facture: invoice
      };
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
  setPending() {
    this.updateStatus('pending');
  }
  setDone() {
    this.updateStatus('done');
  }
  uploadInvoice(file: Blob) {
    this.storageService.uploadInvoice(this.idSignal(), file).then((url) => {
      this.partnerService.update(this.idSignal(), {
        invoiceUrl: url
      });
    });
  }
}
