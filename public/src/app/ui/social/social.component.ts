import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { VideoInputComponent } from 'src/app/v3/video-input.component';

import { environment } from '../../../environments/environment';
import { Company, WorkflowStep } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { StorageService } from '../../storage.service';
import { FilesComponent } from '../files/files.component';
import { UploadComponent } from '../upload/upload.component';

@Component({
  selector: 'cms-social',
  imports: [
    CommonModule,
    MatProgressSpinner,
    FilesComponent,
    UploadComponent,
    MatDividerModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    VideoInputComponent
  ],
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css']
})
export class SocialComponent {
  readonly company = input.required<Company>();
  readonly id = input.required<string>();
  readonly step = input.required<WorkflowStep>();
  isAdmin = signal(false);

  idSignal = computed(() => this.id as unknown as string);
  stepSignal = computed(() => this.step as unknown as WorkflowStep);
  companySignal = computed(() => this.company as unknown as Company);

  uploadingVideo = signal(false);

  private readonly partnerService = inject(PartnerService);
  private readonly storageService = inject(StorageService);
  private readonly auth = inject(Auth);

  logos = computed(() => {
    return {
      Logo: this.companySignal().logoUrl!
    };
  });

  videos = linkedSignal(() => {
    return {
      Video: this.companySignal().videoUrl!,
      'Vidéo Editée': this.companySignal().editedVideoUrl!
    };
  });

  ngOnInit() {
    this.auth.onAuthStateChanged((state) => {
      this.isAdmin.set(state?.email?.endsWith('@' + environment.emailDomain) ?? false);
    });
  }
  update() {
    this.partnerService.update(this.idSignal(), {
      linkedinAccount: this.companySignal().linkedinAccount || '',
      twitterAccount: this.companySignal().twitterAccount || '',
      twitter: this.companySignal().twitter || '',
      linkedin: this.companySignal().linkedin || '',
      description: this.companySignal().description || '',
      keepDevFestTeam: this.companySignal().keepDevFestTeam || false,
      socialInformationComplete: this.companySignal().socialInformationComplete ?? false
    });
  }

  uploadLogo(file: Blob) {
    this.storageService.uploadFile(this.idSignal(), file).then((url: string) => {
      this.partnerService.update(this.idSignal(), {
        logoUrl: url
      });
    });
  }

  uploadEditedVideo(file: Blob) {
    this.uploadingVideo.set(true);
    this.storageService
      .uploadVideo(this.idSignal(), file)
      .then((url: string) => {
        this.partnerService.update(this.idSignal(), {
          editedVideoUrl: url
        });
        this.videos.set({ Video: this.videos().Video, 'Vidéo Editée': url });
      })
      .finally(() => this.uploadingVideo.set(false));
  }

  uploadVideo(file: Blob) {
    this.uploadingVideo.set(true);
    this.storageService
      .uploadVideo(this.idSignal(), file)
      .then((url: string) => {
        this.partnerService.update(this.idSignal(), {
          videoUrl: url
        });
        this.videos.set({ Video: url, 'Vidéo Editée': this.videos()['Vidéo Editée'] });
      })
      .finally(() => this.uploadingVideo.set(false));
  }
}
