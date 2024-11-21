import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workflow, WorkflowStep, Company, State } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { UploadComponent } from '../upload/upload.component';
import { FilesComponent } from '../files/files.component';
import { StorageService } from '../../storage.service';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'cms-signed',
    imports: [
        CommonModule,
        UploadComponent,
        FilesComponent,
        MatIconModule,
        MatButtonModule,
    ],
    templateUrl: './signed.component.html',
    styleUrls: ['./signed.component.scss']
})
export class SignedComponent {
  @Input({ required: true }) workflow!: Workflow;
  @Input({ required: true }) step!: WorkflowStep;
  @Input({ required: true }) company!: Company;
  @Input({ required: true }) id!: string;

  files = {};
  isAdmin = false;

  private readonly partnerService = inject(PartnerService);
  private readonly storageService = inject(StorageService);
  private readonly auth = inject(Auth);

  ngOnInit() {
    this.auth.onAuthStateChanged((state) => {
      this.isAdmin =
        state?.email?.endsWith('@' + environment.emailDomain) ?? false;
    });

    if (this.company.conventionSignedUrl) {
      this.storageService.getSignedConvention(this.id).then((invoice) => {
        this.files = {
          'Convention signée': invoice,
        };
      });
    }
  }

  updateStatus(status: State) {
    this.partnerService.update(this.id, {
      status: {
        ...this.company.status,
        [this.step.key]: status,
      },
    });
  }

  setDone() {
    this.updateStatus('done');
  }

  uploadConvention(file: Blob) {
    this.storageService
      .uploadFile(this.id, file, 'conventionSigned')
      .then((url) => {
        this.partnerService.update(this.id, {
          conventionSignedUrl: url,
        });
      });
  }
}
