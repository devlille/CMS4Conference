import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnerService } from '../../services/partner.service';
import { Company, WorkflowStep } from '../../model/company';
import { FilesComponent } from '../files/files.component';
import { UploadComponent } from '../upload/upload.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../../storage.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'cms-admin-social',
  standalone: true,
  imports: [
    CommonModule,
    FilesComponent,
    UploadComponent,
    MatFormFieldModule,
    FormsModule,
    MatDividerModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './admin-social.component.html',
  styleUrls: ['./admin-social.component.scss'],
})
export class AdminSocialComponent {
  @Input({ required: true }) company!: Company;
  @Input({ required: true }) id!: string;
  @Input({ required: true }) step!: WorkflowStep;
  files = {};

  private readonly partnerService = inject(PartnerService);
  private readonly storageService = inject(StorageService);

  ngOnInit() {
    this.files = {
      Logo: this.company.logoUrl,
    };
  }
  update() {
    this.partnerService.update(this.id, {
      linkedinAccount: this.company.linkedinAccount || '',
      twitterAccount: this.company.twitterAccount || '',
      twitter: this.company.twitter || '',
      linkedin: this.company.linkedin || '',
      description: this.company.description || '',
      keepDevFestTeam: this.company.keepDevFestTeam || false,
    });
  }
  upload(file: Blob) {
    this.storageService.uploadFile(this.id, file).then((url) => {
      this.partnerService.update(this.id, {
        logoUrl: url,
      });
    });
  }
}
