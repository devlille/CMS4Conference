import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Company, WorkflowStep } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { FilesComponent } from '../files/files.component';
import { UploadComponent } from '../upload/upload.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StorageService } from '../../storage.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Auth } from '@angular/fire/auth';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'cms-social',
    imports: [
        CommonModule,
        FilesComponent,
        UploadComponent,
        MatDividerModule,
        MatInputModule,
        FormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
    ],
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
      Logo: this.company().logoUrl,
    };

    this.auth.onAuthStateChanged((state) => {
      this.isAdmin =
        state?.email?.endsWith('@' + environment.emailDomain) ?? false;
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
      socialInformationComplete:
        this.company().socialInformationComplete ?? false,
    });
  }
  upload(file: Blob) {
    this.storageService.uploadFile(this.id(), file).then((url: string) => {
      this.partnerService.update(this.id(), {
        logoUrl: url,
      });
    });
  }
}
