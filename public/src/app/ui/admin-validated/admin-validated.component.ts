import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { environment } from '../../../environments/environment';
import { Company, State, Workflow, WorkflowStep } from '../../model/company';
import { PartnerService } from '../../services/partner.service';
import { StorageService } from '../../storage.service';

@Component({
  selector: 'cms-admin-validated',
  imports: [CommonModule, MatFormFieldModule, FormsModule, MatButtonModule, MatInputModule, MatIconModule],
  templateUrl: './admin-validated.component.html',
  styleUrls: ['./admin-validated.component.scss']
})
export class AdminValidatedComponent {
  readonly workflow = input<Workflow>();
  readonly step = input<WorkflowStep>();
  readonly company = input.required<Company>();
  readonly id = input<string>();

  files = {};
  choice = '';
  isAdmin: boolean = false;

  private readonly partnerService = inject(PartnerService);
  private readonly storageService = inject(StorageService);
  private readonly auth = inject(Auth);

  options: { value: string; label: string }[] = [];
  async ngOnInit() {
    const config = await this.partnerService.getCurrentConfiguration();

    this.auth.onAuthStateChanged((state) => {
      this.isAdmin = state?.email?.endsWith('@' + environment.emailDomain) ?? false;

      const options = config.sponsorships.map((sponsorship) => ({
        value: sponsorship.name.toLowerCase(),
        label: sponsorship.name.toLowerCase()
      }));
      if (this.isAdmin) {
        this.options = options;

        //TO BE REMOVED NEXT YEAR
        const company = this.company();
        company.sponsoring = company.sponsoring.toLocaleLowerCase();
        company.secondSponsoring = company.secondSponsoring?.toLocaleLowerCase();
      } else {
        this.options = [options.find(({ value }) => value === this.company().sponsoring.toLowerCase())!];
        if (this.company()?.secondSponsoring) {
          this.options.push(options.find(({ value }) => value === this.company().secondSponsoring?.toLocaleLowerCase())!);
        }
      }
    });
    const company = this.company();
    if (!company) {
      return;
    }

    this.choice = company.sponsoring;
  }

  updateStatus(status: State) {
    this.partnerService.update(this.id()!, {
      status: {
        ...(this.company()?.status ?? {}),
        [this.step()?.key ?? '']: status
      }
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
    const company = this.company();
    this.partnerService.update(this.id()!, {
      sponsoring: this.choice,
      secondSponsoring: this.choice === company?.sponsoring ? company?.secondSponsoring : company?.sponsoring
    });
  }
  uploadConvention(file: Blob) {
    this.storageService.uploadConvention(this.id()!, file).then((url) => {
      this.partnerService.update(this.id()!, {
        conventionUrl: url
      });
    });
  }
  uploadDevis(file: Blob) {
    this.storageService.uploadDevis(this.id()!, file).then((url) => {
      this.partnerService.update(this.id()!, {
        devisUrl: url
      });
    });
  }
}
