import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workflow, WorkflowStep, Company, State } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FilesComponent } from '../files/files.component';
import { UploadComponent } from '../upload/upload.component';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../storage.service';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '@angular/fire/auth';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'cms-admin-validated',
  standalone: true,
  imports: [
    CommonModule,
    FilesComponent,
    UploadComponent,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './admin-validated.component.html',
  styleUrls: ['./admin-validated.component.scss'],
})
export class AdminValidatedComponent {
  @Input() workflow: Workflow | undefined;
  @Input() step: WorkflowStep | undefined;
  @Input() company: Company | undefined;
  @Input() id: string | undefined;

  files = {};
  choice = '';
  isAdmin: boolean = false;

  private readonly partnerService = inject(PartnerService);
  private readonly storageService = inject(StorageService);
  private readonly auth = inject(Auth);

  options: { value: string; label: string }[] = [];
  ngOnInit() {
    this.auth.onAuthStateChanged((state) => {
      this.isAdmin =
        state?.email?.endsWith('@' + environment.emailDomain) ?? false;

      const options = environment.sponsoringTypes;
      if (this.isAdmin) {
        this.options = options;
      } else {
        this.options = [
          options.find(({ value }) => value === this.company?.sponsoring)!,
        ];
        if (this.company?.secondSponsoring) {
          this.options.push(
            options.find(
              ({ value }) => value === this.company?.secondSponsoring,
            )!,
          );
        }
      }
    });
    if (!this.company) {
      return;
    }

    this.choice = this.company.sponsoring;
  }

  updateStatus(status: State) {
    this.partnerService.update(this.id!, {
      status: {
        ...(this.company?.status ?? {}),
        [this.step?.key ?? '']: status,
      },
    });
  }
  setPending() {
    this.updateStatus('pending');
  }
  setDone() {
    this.updateStatus('done');
  }
  regenerate() {
    this.updateStatus('retry');
  }
  setKo() {
    this.updateStatus('refused');
  }
  updateSponsoring() {
    this.partnerService.update(this.id!, {
      sponsoring: this.choice,
      secondSponsoring:
        this.choice === this.company?.sponsoring
          ? this.company?.secondSponsoring
          : this.company?.sponsoring,
    });
  }
  uploadConvention(file: Blob) {
    this.storageService.uploadConvention(this.id!, file).then((url) => {
      this.partnerService.update(this.id!, {
        conventionUrl: url,
      });
    });
  }
  uploadDevis(file: Blob) {
    this.storageService.uploadDevis(this.id!, file).then((url) => {
      this.partnerService.update(this.id!, {
        devisUrl: url,
      });
    });
  }
}
