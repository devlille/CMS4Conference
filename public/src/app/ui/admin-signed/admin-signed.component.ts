import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workflow, WorkflowStep, Company, State } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { MatButtonModule } from '@angular/material/button';
import { UploadComponent } from '../upload/upload.component';
import { FilesComponent } from '../files/files.component';
import { StorageService } from '../../storage.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'cms-admin-signed',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    UploadComponent,
    FilesComponent,
    MatIconModule,
  ],
  templateUrl: './admin-signed.component.html',
  styleUrls: ['./admin-signed.component.scss'],
})
export class AdminSignedComponent {
  @Input() workflow: Workflow | undefined;
  @Input({ required: true }) step!: WorkflowStep;
  @Input() company: Company | undefined;
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
    this.partnerService.update(this.id!, {
      status: {
        ...this.company!.status,
        [this.step.key]: status,
      },
    });
  }

  setDone() {
    this.updateStatus('done');
  }

  uploadConvention(file: Blob) {
    this.storageService.uploadSignedConvention(this.id, file).then((url) => {
      this.partnerService.update(this.id, {
        conventionSignedUrl: url,
      });
    });
  }
}
