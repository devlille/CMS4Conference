import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workflow, WorkflowStep, Company, State } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { MatButtonModule } from '@angular/material/button';
import { FilesComponent } from '../files/files.component';
import { UploadComponent } from '../upload/upload.component';
import { StorageService } from '../../storage.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'cms-admin-paid',
    imports: [
        CommonModule,
        MatButtonModule,
        FilesComponent,
        UploadComponent,
        MatIconModule,
    ],
    templateUrl: './admin-paid.component.html'
})
export class AdminPaidComponent {
  readonly workflow = input.required<Workflow>();
  readonly step = input.required<WorkflowStep>();
  readonly company = input.required<Company>();
  readonly id = input.required<string>();
  files = {};

  private readonly partnerService = inject(PartnerService);
  private readonly storageService = inject(StorageService);

  ngOnInit() {
    this.storageService.getInvoice(this.id()).then((invoice) => {
      this.files = {
        Facture: invoice,
      };
    });
  }

  updateStatus(status: State) {
    this.partnerService.update(this.id(), {
      status: {
        ...this.company().status,
        [this.step().key]: status,
      },
    });
  }
  setPending() {
    this.updateStatus('pending');
  }
  setDone() {
    this.updateStatus('done');
  }
  uploadInvoice(file: Blob) {
    this.storageService.uploadInvoice(this.id(), file).then((url) => {
      this.partnerService.update(this.id(), {
        invoiceUrl: url,
      });
    });
  }
}
