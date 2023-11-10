import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workflow, WorkflowStep, Company, State } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { FilesComponent } from '../files/files.component';
import { UploadComponent } from '../upload/upload.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../../storage.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'cms-admin-communicated',
  standalone: true,
  imports: [
    CommonModule,
    FilesComponent,
    UploadComponent,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './admin-communicated.component.html',
  styleUrls: ['./admin-communicated.component.scss'],
})
export class AdminCommunicatedComponent {
  @Input({ required: true }) workflow!: Workflow;
  @Input({ required: true }) step!: WorkflowStep;
  @Input({ required: true }) company!: Company;
  @Input({ required: true }) id!: string;
  files = {};

  private readonly partnerService = inject(PartnerService);
  private readonly storageService = inject(StorageService);

  setDate() {
    this.partnerService.update(this.id, {
      publicationDate: this.company.publicationDate,
    });
  }
  uploadFlyer(file: Blob) {
    this.storageService.uploadFile(this.id, file, 'flyers').then((url) => {
      this.partnerService.update(this.id, {
        flyerUrl: url,
      });
    });
  }

  ngOnInit() {
    this.storageService.getFlyers(this.id).then((flyer) => {
      this.files = {
        Flyer: flyer,
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
  setDone() {
    this.updateStatus('done');
  }
}
