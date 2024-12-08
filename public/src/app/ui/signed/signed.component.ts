import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
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
  templateUrl: './signed.component.html',
  styleUrls: ['./signed.component.scss']
})
export class SignedComponent {
  readonly workflow = input.required<Workflow>();
  readonly step = input.required<WorkflowStep>();
  readonly company = input.required<Company>();
  readonly id = input.required<string>();

  files = {};
  isAdmin = false;

  private readonly partnerService = inject(PartnerService);
  private readonly storageService = inject(StorageService);
  private readonly auth = inject(Auth);

  ngOnInit() {
    this.auth.onAuthStateChanged((state) => {
      this.isAdmin = state?.email?.endsWith('@' + environment.emailDomain) ?? false;
    });

    if (this.company().conventionSignedUrl) {
      this.storageService.getSignedConvention(this.id()).then((invoice) => {
        this.files = {
          'Convention signée': invoice
        };
      });
    }
  }

  updateStatus(status: State) {
    this.partnerService.update(this.id(), {
      status: {
        ...this.company().status,
        [this.step().key]: status
      }
    });
  }

  setDone() {
    this.updateStatus('done');
  }

  uploadConvention(file: Blob) {
    this.storageService.uploadFile(this.id(), file, 'conventionSigned').then((url) => {
      this.partnerService.update(this.id(), {
        conventionSignedUrl: url
      });
    });
  }
}
