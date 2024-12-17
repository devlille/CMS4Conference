import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, resource, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { environment } from '../../../environments/environment';
import { Workflow, WorkflowStep, Company, State } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { StorageService } from '../../storage.service';
import { FilesComponent } from '../files/files.component';
import { UploadComponent } from '../upload/upload.component';

@Component({
  selector: 'cms-signed',
  imports: [CommonModule, UploadComponent, FilesComponent, MatIconModule, MatButtonModule],
  templateUrl: './signed.component.html'
})
export class SignedComponent {
  readonly workflow = input.required<Workflow>();
  readonly step = input.required<WorkflowStep>();
  readonly company = input.required<Company>();
  readonly id = input.required<string>();

  idSignal = computed(() => this.id as unknown as string);
  stepSignal = computed(() => this.step as unknown as WorkflowStep);
  companySignal = computed(() => this.company as unknown as Company);
  files = resource({
    request: () => ({ id: this.idSignal() }),
    loader: ({ request: { id } }) => {
      return this.storageService.getSignedConvention(id).then((invoice) => {
        console.log(invoice);
        return {
          'Convention signée': invoice
        };
      });
    }
  });

  choice = '';
  isAdmin = signal(true);

  private readonly partnerService = inject(PartnerService);
  private readonly storageService = inject(StorageService);
  private readonly auth = inject(Auth);

  ngOnInit() {
    this.auth.onAuthStateChanged((state) => {
      this.isAdmin.set(state?.email?.endsWith('@' + environment.emailDomain) ?? false);
    });
  }

  updateStatus(status: State) {
    this.partnerService.update(this.id as unknown as string, {
      status: {
        ...this.companySignal().status,
        [this.stepSignal().key]: status
      }
    });
  }

  setDone() {
    this.updateStatus('done');
  }

  uploadConvention(file: Blob) {
    this.storageService.uploadFile(this.id as unknown as string, file, 'conventionSigned').then((url) => {
      this.partnerService.update(this.id as unknown as string, {
        conventionSignedUrl: url
      });
    });
  }
}
