import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workflow, WorkflowStep, Company, State } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { UploadComponent } from '../upload/upload.component';
import { FilesComponent } from '../files/files.component';
import { StorageService } from '../../storage.service';

@Component({
  selector: 'cms-signed',
  standalone: true,
  imports: [CommonModule, UploadComponent, FilesComponent],
  templateUrl: './signed.component.html',
  styleUrls: ['./signed.component.scss'],
})
export class SignedComponent {
  @Input({ required: true }) workflow!: Workflow;
  @Input({ required: true }) step!: WorkflowStep;
  @Input({ required: true }) company!: Company;
  @Input({ required: true }) id!: string;
  files = {};

  private readonly partnerService = inject(PartnerService);
  private readonly storageService = inject(StorageService);

  ngOnInit() {
    this.storageService.getSignedConvention(this.id).then((invoice) => {
      this.files = {
        'Convention signée': invoice,
      };
    });
  }

  updateStatus(status: State) {
    this.partnerService.update(this.id, {
      status: {
        ...this.company.status,
        [this.step.key]: status,
      },
    });
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
