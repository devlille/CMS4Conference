import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { environment } from '../../../environments/environment';
import { Company, WorkflowStep } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { StorageService } from '../../storage.service';
import { FilesComponent } from '../files/files.component';
import { UploadComponent } from '../upload/upload.component';

@Component({
  selector: 'cms-social',
  imports: [CommonModule, FilesComponent, UploadComponent, MatDividerModule, MatInputModule, FormsModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatCheckboxModule],
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
export class SocialComponent {
  readonly company = input.required<Company>();
  readonly id = input.required<string>();
  readonly step = input.required<WorkflowStep>();
  files = {};
  isAdmin: boolean = false;

  private readonly partnerService = inject(PartnerService);
  private readonly storageService = inject(StorageService);
  private readonly auth = inject(Auth);

  ngOnInit() {
    this.files = {
      Logo: this.company().logoUrl
    };

    this.auth.onAuthStateChanged((state) => {
      this.isAdmin = state?.email?.endsWith('@' + environment.emailDomain) ?? false;
    });
  }
  update() {
    this.partnerService.update(this.id(), {
      linkedinAccount: this.company().linkedinAccount || '',
      twitterAccount: this.company().twitterAccount || '',
      twitter: this.company().twitter || '',
      linkedin: this.company().linkedin || '',
      description: this.company().description || '',
      keepDevFestTeam: this.company().keepDevFestTeam || false,
      socialInformationComplete: this.company().socialInformationComplete ?? false
    });
  }
  upload(file: Blob) {
    this.storageService.uploadFile(this.id(), file).then((url: string) => {
      this.partnerService.update(this.id(), {
        logoUrl: url
      });
    });
  }
}
